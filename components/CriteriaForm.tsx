import React, { useState } from 'react';
import { EvaluationCriteria } from '../types';

interface CriteriaFormProps {
  onSubmit: (criteria: EvaluationCriteria) => void;
  fileName: string;
}

export const CriteriaForm: React.FC<CriteriaFormProps> = ({ onSubmit, fileName }) => {
  const [criteria, setCriteria] = useState<EvaluationCriteria>({
    clarityOfILOs: true,
    alignment: true,
    assessmentQuality: true,
    referenceCurrency: true,
    structuralCompliance: true,
    customInstructions: '',
    benchmarkUniversities: 'Stanford, MIT, Oxford, Cambridge',
  });

  const handleChange = (key: keyof EvaluationCriteria, value: any) => {
    setCriteria(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             </div>
             <h2 className="text-xl font-bold text-slate-800">Configure Evaluation</h2>
          </div>
          <p className="text-sm text-slate-500 pl-12">File: <span className="font-medium text-slate-700">{fileName}</span></p>
        </div>

        <div className="p-8 space-y-8">
          
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Core Criteria</h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                { key: 'clarityOfILOs', label: 'Evaluate ILO Clarity & Specificity', desc: 'Checks if learning outcomes are measurable and use Bloom’s taxonomy.' },
                { key: 'alignment', label: 'Check Topic Alignment', desc: 'Ensures weekly lessons support the stated learning outcomes.' },
                { key: 'assessmentQuality', label: 'Analyze Assessment Methods', desc: 'Reviews variety, weightage, and fairness of evaluations.' },
                { key: 'referenceCurrency', label: 'Verify Reference Currency', desc: 'Checks if textbooks and resources are up-to-date (last 5-10 years).' },
                { key: 'structuralCompliance', label: 'Review Overall Structure', desc: 'Ensures all standard syllabus components are present.' },
              ].map((item) => (
                <label key={item.key} className="flex items-start gap-4 p-4 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors cursor-pointer group">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={criteria[item.key as keyof EvaluationCriteria] as boolean}
                      onChange={(e) => handleChange(item.key as keyof EvaluationCriteria, e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-slate-900 group-hover:text-blue-700">{item.label}</span>
                    <span className="block text-xs text-slate-500 mt-1">{item.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Benchmarking Target</h3>
             <div className="relative">
                <input 
                  type="text" 
                  value={criteria.benchmarkUniversities}
                  onChange={(e) => handleChange('benchmarkUniversities', e.target.value)}
                  className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                  placeholder="e.g. Harvard, Stanford, local competitors"
                />
                <p className="text-xs text-slate-500 mt-2">The AI will search for course equivalents at these institutions.</p>
             </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Custom Instructions</h3>
            <textarea
              value={criteria.customInstructions}
              onChange={(e) => handleChange('customInstructions', e.target.value)}
              rows={3}
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              placeholder="e.g. Focus specifically on the inclusion of AI ethics in the curriculum..."
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => onSubmit(criteria)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              Start Analysis
              <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
