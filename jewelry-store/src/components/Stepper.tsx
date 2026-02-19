'use client';

interface StepperProps {
  steps: { id: number; title: string; titleAr: string }[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="w-full" dir="rtl">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div 
              className="flex flex-col items-center cursor-pointer"
              onClick={() => onStepClick?.(step.id)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep > step.id
                    ? 'bg-[#c9a962] text-white'
                    : currentStep === step.id
                    ? 'bg-[#c9a962] text-white ring-4 ring-[#c9a962]/20'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step.id ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span className={`mt-2 text-xs font-medium ${currentStep >= step.id ? 'text-[#c9a962]' : 'text-gray-400'}`}>
                {step.titleAr}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2">
                <div
                  className={`h-full transition-all duration-300 ${
                    currentStep > step.id ? 'bg-[#c9a962]' : 'bg-gray-200'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
