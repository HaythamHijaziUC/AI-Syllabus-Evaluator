export enum AppState {
  UPLOAD = 'UPLOAD',
  CRITERIA = 'CRITERIA',
  PROCESSING = 'PROCESSING',
  REPORT = 'REPORT',
}

export interface EvaluationCriteria {
  clarityOfILOs: boolean;
  alignment: boolean;
  assessmentQuality: boolean;
  referenceCurrency: boolean;
  structuralCompliance: boolean;
  customInstructions: string;
  benchmarkUniversities: string;
}

export interface SyllabusMetadata {
  title: string;
  code: string;
  institution: string;
  description: string;
}

export interface SectionScore {
  section: string;
  score: number; // 0-100
  feedback: string;
  strengths: string[];
  weaknesses: string[];
}

export interface ILOAnalysis {
  original: string;
  quality: 'Low' | 'Medium' | 'High';
  critique: string;
  suggestion: string;
}

export interface BenchmarkResult {
  university: string;
  courseTitle: string;
  comparison: string;
  keyDifferences: string[];
}

export interface FinalReport {
  metadata: SyllabusMetadata;
  overallScore: number;
  sectionScores: SectionScore[];
  iloAnalysis: ILOAnalysis[];
  benchmarks: BenchmarkResult[];
  recommendations: string[];
  gapAnalysis: string;
}
