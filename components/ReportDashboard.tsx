import React from 'react';
import { FinalReport, SectionScore, ILOAnalysis, BenchmarkResult } from '../types';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';

interface ReportDashboardProps {
  data: FinalReport;
  onReset: () => void;
}

export const ReportDashboard: React.FC<ReportDashboardProps> = ({ data, onReset }) => {
  
  // Prepare Radar Data
  const radarData = data.sectionScores.map(s => ({
    subject: s.section,
    A: s.score,
    fullMark: 100,
  }));

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-amber-100';
    return 'bg-red-100';
  };

  return (
    <div className="pb-20">
      {/* Header Summary */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{data.metadata.code}</span>
                 <span className="text-sm text-slate-500">{data.metadata.institution}</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{data.metadata.title}</h1>
              <p className="text-slate-600 mt-2 max-w-2xl">{data.metadata.description}</p>
            </div>
            <div className="flex items-center gap-6">
               <div className="text-right">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Overall Score</p>
                  <p className={`text-5xl font-bold ${getScoreColor(data.overallScore)}`}>{data.overallScore}</p>
               </div>
               <button onClick={onReset} className="text-sm text-blue-600 hover:underline">Analyze Another</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Charts & Details */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Section Breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
               <h3 className="text-lg font-bold text-slate-800 mb-6">Performance Breakdown</h3>
               <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Syllabus" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {data.sectionScores.map((s, i) => (
                    <div key={i} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-slate-700">{s.section}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${getScoreBg(s.score)} ${getScoreColor(s.score)}`}>
                          {s.score}/100
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{s.feedback}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Benchmarking */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Global Benchmarking
               </h3>
               {data.benchmarks && data.benchmarks.length > 0 ? (
                 <div className="space-y-4">
                   {data.benchmarks.map((b, i) => (
                     <div key={i} className="border-l-4 border-purple-500 pl-4 py-1">
                       <h4 className="font-semibold text-slate-800">{b.university} - {b.courseTitle}</h4>
                       <p className="text-sm text-slate-600 mt-1 mb-2">{b.comparison}</p>
                       <div className="flex flex-wrap gap-2">
                         {b.keyDifferences.map((diff, j) => (
                           <span key={j} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md border border-purple-100">{diff}</span>
                         ))}
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <p className="text-slate-500 italic">No direct benchmarks found.</p>
               )}
            </div>

            {/* ILO Analysis */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Intended Learning Outcomes (ILO) Review</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Original ILO</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Critique & Improvement</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {data.iloAnalysis.map((ilo, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 text-sm text-slate-700 w-1/2 align-top">
                          {ilo.original}
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                              ${ilo.quality === 'High' ? 'bg-green-100 text-green-800' : 
                                ilo.quality === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              Quality: {ilo.quality}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 align-top">
                          <p className="mb-2"><strong className="text-slate-800">Critique:</strong> {ilo.critique}</p>
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <p className="text-blue-800 font-medium text-xs uppercase mb-1">Suggested Revision</p>
                            <p className="text-blue-900">{ilo.suggestion}</p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        </div>

        {/* Right Col: Summary & Actions */}
        <div className="space-y-8">
            {/* Gap Analysis */}
            <div className="bg-amber-50 rounded-2xl shadow-sm border border-amber-200 p-6">
              <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Gap Analysis
              </h3>
              <p className="text-amber-800 text-sm leading-relaxed">
                {data.gapAnalysis}
              </p>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Recommendations</h3>
              <ul className="space-y-3">
                {data.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-sm text-slate-600">{rec}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full mt-6 bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download PDF Report
              </button>
            </div>
        </div>

      </div>
    </div>
  );
};
