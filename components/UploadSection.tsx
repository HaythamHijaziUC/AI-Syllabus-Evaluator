import React, { useCallback, useState } from 'react';

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  }, [onFileSelect]);

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Evaluate Your Course Syllabus</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Upload your course outline to receive an AI-powered quality assessment, gap analysis, and benchmarking against top global universities.
        </p>
      </div>

      <div 
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ease-in-out
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-blue-400'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-800">Drag & drop your syllabus here</p>
            <p className="text-slate-500 mt-2">Supported formats: PDF, Text</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <label className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer transition-colors">
              Browse Files
              <input type="file" className="hidden" accept=".pdf,.txt" onChange={handleFileInput} />
            </label>
            
            <button 
              onClick={() => alert("This feature requires a configured Google Cloud Project with Drive API enabled. For this demo, please use the 'Browse Files' option to upload a local syllabus.")}
              className="inline-flex items-center px-6 py-3 border border-slate-300 text-base font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none transition-colors"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" className="w-5 h-5 mr-2" alt="Drive" />
              Select from Drive
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="font-semibold text-slate-900">Instant Evaluation</h3>
          <p className="text-sm text-slate-500 mt-2">Get immediate scoring on ILOs, assessment methods, and course alignment.</p>
        </div>
        <div className="p-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <h3 className="font-semibold text-slate-900">Global Benchmarking</h3>
          <p className="text-sm text-slate-500 mt-2">Compare your curriculum against similar courses from top universities worldwide.</p>
        </div>
        <div className="p-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="font-semibold text-slate-900">Actionable Insights</h3>
          <p className="text-sm text-slate-500 mt-2">Receive specific recommendations to improve structure and learning outcomes.</p>
        </div>
      </div>
    </div>
  );
};
