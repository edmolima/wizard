import type { ReactNode } from 'react';
import { VisuallyHidden } from './VisuallyHidden';

interface FormStepProps {
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  error?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  submitLabel?: string;
}

export function FormStep({
  title,
  description,
  children,
  onSubmit,
  isSubmitting = false,
  error,
  onBack,
  showBackButton = false,
  submitLabel = 'Continue',
}: FormStepProps) {
  const formId = `form-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <form
      id={formId}
      onSubmit={onSubmit}
      className="space-y-8"
      aria-labelledby={`${formId}-title`}
      aria-describedby={description ? `${formId}-description` : undefined}
      noValidate
    >
      <div className="space-y-2">
        <h2
          id={`${formId}-title`}
          className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900"
        >
          {title}
        </h2>
        {description && (
          <p
            id={`${formId}-description`}
            className="text-base text-gray-600 max-w-2xl leading-relaxed"
          >
            {description}
          </p>
        )}
      </div>

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-lg border border-red-200 bg-red-50 p-4"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
                <span className="text-sm font-medium leading-none text-red-600">!</span>
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <VisuallyHidden id={`${formId}-fields-title`}>Form fields for {title}</VisuallyHidden>
        <div role="group" aria-labelledby={`${formId}-fields-title`} className="space-y-6">
          {children}
        </div>
      </div>

      <div
        className={`flex flex-col-reverse sm:flex-row ${
          showBackButton ? 'sm:justify-between sm:space-x-4' : 'sm:justify-end'
        } pt-6 border-t border-gray-200`}
      >
        {showBackButton && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-100 h-10 px-4 py-2 mt-3 sm:mt-0 w-full sm:w-auto"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 w-full sm:w-auto ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Processing</span>
            </span>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
