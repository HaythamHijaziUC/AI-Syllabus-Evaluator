import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { UploadSection } from './components/UploadSection';
import { CriteriaForm } from './components/CriteriaForm';
import { AnalysisView } from './components/AnalysisView';
import { ReportDashboard } from './components/ReportDashboard';
import { AppState, EvaluationCriteria, FinalReport } from './types';
import { analyzeSyllabus } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [file, setFile] = useState<File | null>(null);
  const [criteria, setCriteria] = useState<EvaluationCriteria | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<'EXTRACTING' | 'EVALUATING' | 'BENCHMARKING' | 'SYNTHESIZING'>('EXTRACTING');
  const [reportData, setReportData] = useState<FinalReport | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setAppState(AppState.CRITERIA);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the "data:*/*;base64," prefix for the API
          const base64Data = reader.result.split(',')[1];
          resolve(base64Data);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleCriteriaSubmit = async (selectedCriteria: EvaluationCriteria) => {
    if (!file) return;
    setCriteria(selectedCriteria);
    setAppState(AppState.PROCESSING);

    try {
      // Convert file
      const base64 = await fileToBase64(file);
      
      // Simulate progress steps visually while the API calls happen
      // Realistically, these are tied to the service execution, but for UX smoothness we animate
      setAnalysisStatus('EXTRACTING');
      
      // We initiate the call. 
      // The service does Extraction -> Benchmarking -> Report internally.
      // We can use a small timer to simulate the steps for the user if the API is fast,
      // or just update them rapidly.
      
      const updateProgress = () => {
          setTimeout(() => setAnalysisStatus('EVALUATING'), 2000);
          setTimeout(() => setAnalysisStatus('BENCHMARKING'), 5000);
          setTimeout(() => setAnalysisStatus('SYNTHESIZING'), 8000);
      };
      updateProgress();

      const report = await analyzeSyllabus(base64, file.type || 'application/pdf', selectedCriteria);
      
      setReportData(report);
      setAppState(AppState.REPORT);
    } catch (error) {
      console.error(error);
      alert('Analysis failed. Please check your API key and file format.');
      setAppState(AppState.UPLOAD);
    }
  };

  const handleReset = () => {
    setFile(null);
    setCriteria(null);
    setReportData(null);
    setAppState(AppState.UPLOAD);
  };

  return (
    <Layout>
      {appState === AppState.UPLOAD && (
        <UploadSection onFileSelect={handleFileSelect} />
      )}
      
      {appState === AppState.CRITERIA && file && (
        <CriteriaForm onSubmit={handleCriteriaSubmit} fileName={file.name} />
      )}
      
      {appState === AppState.PROCESSING && (
        <AnalysisView status={analysisStatus} />
      )}
      
      {appState === AppState.REPORT && reportData && (
        <ReportDashboard data={reportData} onReset={handleReset} />
      )}
    </Layout>
  );
};

export default App;
