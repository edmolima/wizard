import { useLoanForm } from '../hooks/useLoanForm';

export function SuccessStep() {
  const { resetForm } = useLoanForm();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Application Submitted Successfully!
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Thank you for submitting your loan application. We will review your information and get
            back to you within 2 business days.
          </p>
          <div className="mt-10">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Start New Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
