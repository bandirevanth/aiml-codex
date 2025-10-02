import React, { useState } from 'react';
import { BrandProfileSetup } from './components/BrandProfileSetup';
import { MonitoringConfiguration } from './components/MonitoringConfiguration';
import { VideoUpload } from './components/VideoUpload';
import { MonitoringProgress } from './components/MonitoringProgress';
import { MonitoringResults } from './components/MonitoringResults';
import { BrandProfile, VideoAnalysisConfig, BrandMonitoringReport, MonitoringProgress as MonitoringProgressType } from './types';

type AppStep = 'profile' | 'configuration' | 'upload' | 'monitoring' | 'results';

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('profile');
  const [profile, setProfile] = useState<BrandProfile | null>(null);
  const [configuration, setConfiguration] = useState<VideoAnalysisConfig | null>(null);
  const [monitoringProgress, setMonitoringProgress] = useState<MonitoringProgressType | null>(null);
  const [monitoringReport, setMonitoringReport] = useState<BrandMonitoringReport | null>(null);

  const handleProfileComplete = (brandProfile: BrandProfile) => {
    setProfile(brandProfile);
    setCurrentStep('configuration');
  };

  const handleConfigurationComplete = (config: VideoAnalysisConfig) => {
    setConfiguration(config);
    setCurrentStep('upload');
  };

  const handleMonitoringProgress = (progress: MonitoringProgressType) => {
    setMonitoringProgress(progress);
    if (currentStep !== 'monitoring') {
      setCurrentStep('monitoring');
    }
  };

  const handleMonitoringComplete = (report: BrandMonitoringReport) => {
    setMonitoringReport(report);
    setCurrentStep('results');
  };

  const handleStartOver = () => {
    setCurrentStep('profile');
    setProfile(null);
    setConfiguration(null);
    setMonitoringProgress(null);
    setMonitoringReport(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'profile':
        return <BrandProfileSetup onProfileComplete={handleProfileComplete} />;
      
      case 'configuration':
        return <MonitoringConfiguration onConfigComplete={handleConfigurationComplete} />;
      
      case 'upload':
        return (
          <VideoUpload
            profile={profile!}
            config={configuration!}
            onMonitoringComplete={handleMonitoringComplete}
            onProgress={handleMonitoringProgress}
          />
        );
      
      case 'monitoring':
        return <MonitoringProgress progress={monitoringProgress!} />;
      
      case 'results':
        return (
          <MonitoringResults
            report={monitoringReport!}
            onNewAnalysis={handleStartOver}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-blue-600">
                  Brand Video Monitor
                </h1>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="hidden md:flex items-center space-x-4">
              {['Profile', 'Config', 'Upload', 'Monitor', 'Results'].map((step, index) => {
                const stepKeys: AppStep[] = ['profile', 'configuration', 'upload', 'monitoring', 'results'];
                const isActive = stepKeys[index] === currentStep;
                const isCompleted = stepKeys.indexOf(currentStep) > index;
                
                return (
                  <div
                    key={step}
                    className={`flex items-center ${index < 4 ? 'mr-4' : ''}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium ${
                        isActive ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      {step}
                    </span>
                    {index < 4 && (
                      <div
                        className={`ml-4 w-8 h-0.5 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {renderStep()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>
              Brand Video Monitor - Advanced AI-powered brand monitoring and reputation management
            </p>
            <p className="mt-2">
              Track your brand presence, sentiment, and competitive positioning across video content
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
