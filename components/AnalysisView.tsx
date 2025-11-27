import React from 'react';

interface AnalysisViewProps {
  status: 'EXTRACTING' | 'EVALUATING' | 'BENCHMARKING' | 'SYNTHESIZING';
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ status }) => {
  const steps = [
    { id: 'EXTRACTING', label: 'Extracting Syllabus Content' },
    { id: 'EVALUATING', label: 'Evaluating against Criteria' },
    { id: 'BENCHMARKING', label: 'Searching Benchmarks' },
    { id: 'SYNTHESIZING', label: 'Generating Report' },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(s => s.id === status);
  };

  const currentStep = getCurrentStepIndex();

  return (
    <div className="max-w-xl mx-auto mt-20 px-4 text-center">
      <div className="mb-12">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-2xl animate-pulse">🤖</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Analyzing Syllabus</h2>
        <p className="text-slate-500 mt-2">Our AI is reading your document and comparing it with global standards.</p>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>
        <div className="space-y-8 relative z-10 text-left pl-0">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div key={step.id} className="flex items-center gap-4">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                    isCurrent ? 'bg-white border-blue-600 text-blue-600' : 
                    'bg-white border-slate-200 text-slate-300'}
                `}>
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>
                <div>
                  <p className={`font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                    {step.label}
                  </p>
                  {isCurrent && <p className="text-xs text-blue-500 animate-pulse">Processing...</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
