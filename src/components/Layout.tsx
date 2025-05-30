import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import type { Step } from '../types/loan';
import { VisuallyHidden } from './VisuallyHidden';

interface LayoutProps {
  children: ReactNode;
}

const steps: { step: Step; label: string; path: string }[] = [
  { step: 1, label: 'Personal Information', path: '/loan-application/step1' },
  { step: 2, label: 'Contact Details', path: '/loan-application/step2' },
  { step: 3, label: 'Loan Request', path: '/loan-application/step3' },
  { step: 4, label: 'Financial Information', path: '/loan-application/step4' },
  { step: 5, label: 'Finalization', path: '/loan-application/step5' },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const currentStep = steps.find((step) => step.path === location.pathname)?.step ?? 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <header
        className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm"
        role="banner"
      >
        <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900">
              Loan Application
              <VisuallyHidden> - Multi-step form application process</VisuallyHidden>
            </h1>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                Step {currentStep} of {steps.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <main
          className="relative rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-900/5"
          role="main"
          aria-label={`Step ${currentStep} content`}
        >
          {children}
        </main>

        <footer className="mt-8 flex flex-col items-center justify-center gap-2 text-center text-sm text-gray-500">
          <p>Your information is secure and encrypted</p>
        </footer>
      </div>
    </div>
  );
}
