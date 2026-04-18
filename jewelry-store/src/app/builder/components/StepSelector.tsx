'use client';

interface StepSelectorProps {
  steps: { id: number; title: string; titleAr: string; icon: string }[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function StepSelector({ steps, currentStep, onStepClick }: StepSelectorProps) {
  return (
    <div className="w-full" dir="rtl">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => {
                if (step.id <= currentStep) onStepClick(step.id);
              }}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep > step.id
                    ? 'bg-[#c9a962] text-white shadow-lg shadow-[#c9a962]/30'
                    : currentStep === step.id
                    ? 'bg-[#c9a962] text-white ring-4 ring-[#c9a962]/20 shadow-lg shadow-[#c9a962]/30'
                    : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                }`}
              >
                {currentStep > step.id ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-lg">{step.icon}</span>
                )}
              </div>
              <span className={`mt-2 text-xs font-medium transition-colors ${currentStep >= step.id ? 'text-[#c9a962]' : 'text-gray-400'}`}>
                {step.titleAr}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-1 sm:mx-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
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
