import { GoogleGenAI, Type, Schema } from "@google/genai";
import { EvaluationCriteria, FinalReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const reportSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    metadata: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        code: { type: Type.STRING },
        institution: { type: Type.STRING },
        description: { type: Type.STRING },
      },
      required: ['title', 'code', 'description'],
    },
    overallScore: { type: Type.NUMBER, description: "Overall quality score from 0 to 100" },
    sectionScores: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          section: { type: Type.STRING },
          score: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
    },
    iloAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          quality: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
          critique: { type: Type.STRING },
          suggestion: { type: Type.STRING },
        },
      },
    },
    gapAnalysis: { type: Type.STRING, description: "A summary of missing components compared to standard high-quality syllabuses." },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
};

export const analyzeSyllabus = async (
  fileBase64: string,
  mimeType: string,
  criteria: EvaluationCriteria
): Promise<FinalReport> => {
  
  // 1. First Pass: Analyze the document content locally using Gemini
  const model = "gemini-2.5-flash";
  
  const criteriaPrompt = `
    Evaluate this syllabus based on the following criteria:
    ${criteria.clarityOfILOs ? "- Clarity and specificity of Intended Learning Outcomes (ILOs)" : ""}
    ${criteria.alignment ? "- Alignment between ILOs and weekly topics" : ""}
    ${criteria.assessmentQuality ? "- Quality and variety of assessment methods" : ""}
    ${criteria.referenceCurrency ? "- Currency and completeness of reference materials" : ""}
    ${criteria.structuralCompliance ? "- Overall structure and academic compliance" : ""}
    
    Custom Instructions: ${criteria.customInstructions || "None"}
  `;

  // We do a two-step process for higher quality:
  // 1. Analyze content
  // 2. Perform grounding search (if requested/implied) to benchmark
  // 3. Synthesize

  try {
    // Step 1: Analyze and Extract
    const analysisResponse = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: fileBase64,
            },
          },
          {
            text: `You are an expert Academic Quality Assurance officer. 
            Analyze the attached syllabus file. 
            ${criteriaPrompt}
            
            Provide a detailed structured analysis in JSON format adhering to the schema.
            Be critical but constructive.
            `
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema,
        systemInstruction: "You are a precise academic evaluator.",
      }
    });

    const text = analysisResponse.text;
    if (!text) throw new Error("No response from Gemini");
    const initialAnalysis = JSON.parse(text) as FinalReport;

    // Step 2: Benchmarking (External Search)
    // We search for the course title found in the analysis
    const courseTitle = initialAnalysis.metadata.title;
    const benchmarkUniversities = criteria.benchmarkUniversities || "top global universities";
    
    let benchmarkData: any[] = [];
    
    try {
        const searchPrompt = `Find latest public syllabus or course outline for "${courseTitle}" at ${benchmarkUniversities}. List 2-3 specific examples with their university name, key topics, and assessment methods.`;
        
        const searchResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: searchPrompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        
        // Step 3: Synthesize Benchmarks
        // We take the search results (grounding chunks or text) and format them into our JSON structure
        const benchmarksResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
                Based on the following search results about similar courses:
                ${searchResponse.text}
                
                And the provided grounding metadata (if any):
                ${JSON.stringify(searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [])}

                Compare them to this course description: "${initialAnalysis.metadata.description}".

                Output a JSON array of objects with this shape:
                [
                    {
                        "university": "string",
                        "courseTitle": "string",
                        "comparison": "string (summary of similarities/differences)",
                        "keyDifferences": ["string", "string"]
                    }
                ]
            `,
            config: {
                responseMimeType: "application/json",
            }
        });

        const benchmarkText = benchmarksResponse.text;
        if (benchmarkText) {
             benchmarkData = JSON.parse(benchmarkText);
        }

    } catch (e) {
        console.warn("Benchmarking failed, proceeding with internal analysis only", e);
        benchmarkData = [{
            university: "Search Unavailable",
            courseTitle: "N/A",
            comparison: "Could not perform external benchmarking at this time.",
            keyDifferences: []
        }];
    }

    // Merge results
    return {
        ...initialAnalysis,
        benchmarks: benchmarkData
    };

  } catch (error) {
    console.error("Analysis Failed", error);
    throw error;
  }
};