import React, { useState, useEffect } from 'react';
import { Loader2, FileSearch, Shield, Search } from 'lucide-react';

const STEPS = [
  { text: "Reading reference document...", icon: FileSearch },
  { text: "Parsing HTS structure...", icon: Search },
  { text: "Checking Aluminum derivatives...", icon: Shield },
  { text: "Checking Steel derivatives...", icon: Shield },
  { text: "Verifying exemptions...", icon: FileSearch },
  { text: "Finalizing analysis...", icon: Loader2 }
];

const LoadingAnalysis: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Progress through steps. Total time approx 7-8 seconds.
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const step = STEPS[currentStep];
  const Icon = step.icon;

  return (
    <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors relative overflow-hidden">
      
      {/* Custom Styles for Animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Ambient background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mb-10">
        {/* Pulsing Rings */}
        <div className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/20 rounded-full animate-ping opacity-75 duration-[2000ms]"></div>
        <div className="absolute -inset-4 border border-indigo-50 dark:border-indigo-900/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
        
        {/* Central Icon Container */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-full shadow-xl border border-indigo-100 dark:border-indigo-900 relative z-10 flex items-center justify-center transition-all duration-500">
           {/* Key forces remount to trigger popIn animation on step change */}
           <div key={currentStep} style={{ animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
             <Icon className={`w-10 h-10 text-indigo-600 dark:text-indigo-400 ${currentStep === STEPS.length - 1 ? 'animate-spin' : ''}`} />
           </div>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">Analyzing Compliance</h3>
      
      {/* Animated Text Steps */}
      <div className="h-8 mb-8 relative w-full text-center flex items-center justify-center">
        {STEPS.map((s, idx) => (
           <p 
            key={idx}
            className={`text-slate-500 dark:text-slate-400 font-medium absolute transition-all duration-500 transform ${
                idx === currentStep ? 'opacity-100 translate-y-0 scale-100 blur-0' : 
                idx < currentStep ? 'opacity-0 -translate-y-4 scale-95 blur-sm' : 
                'opacity-0 translate-y-4 scale-95 blur-sm'
            }`}
          >
            {s.text}
          </p>
        ))}
      </div>

      {/* Smooth Progress Bar with Shimmer */}
      <div className="w-72 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative shadow-inner">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-blue-600 transition-all duration-1000 ease-linear rounded-full"
          style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
        >
             {/* Shimmer Effect overlay */}
             <div 
               className="absolute inset-0 bg-white/30 skew-x-12" 
               style={{ animation: 'shimmer 1.5s infinite linear' }}
             ></div>
        </div>
      </div>
      
      {/* Step Dots Indicator */}
      <div className="flex gap-1.5 mt-5">
        {STEPS.map((_, idx) => (
            <div 
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === currentStep ? 'bg-indigo-600 dark:bg-indigo-400 w-4' : 
                    idx < currentStep ? 'bg-indigo-300 dark:bg-indigo-800 w-1.5' : 
                    'bg-slate-200 dark:bg-slate-800 w-1.5'
                }`}
            />
        ))}
      </div>
    </div>
  );
};

export default LoadingAnalysis;