import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { VisuallyHidden } from './VisuallyHidden';

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'required'> {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  currency?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    { label, error, description, className = '', id, required = false, currency = false, ...props },
    ref
  ) => {
    const descriptionId = description ? `${id}-description` : undefined;
    const errorId = error ? `${id}-error` : undefined;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900"
          >
            {label}
            {required && (
              <span className="ml-1 text-red-500" aria-hidden="true">
                *
              </span>
            )}
            {required && <VisuallyHidden> (required)</VisuallyHidden>}
          </label>
          {props.maxLength && (
            <span className="text-xs text-gray-500" data-testid="character-counter">
              {props.value?.toString().length ?? 0}/{props.maxLength}
            </span>
          )}
        </div>
        {description && (
          <p id={descriptionId} className="text-sm text-gray-500 leading-relaxed">
            {description}
          </p>
        )}
        <div className="relative">
          {currency && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base select-none pointer-events-none">
              €
            </span>
          )}
          <input
            ref={ref}
            id={id}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : description ? descriptionId : undefined}
            aria-required={required}
            required={required}
            className={`flex h-10 w-full rounded-md border border-gray-200 bg-white ${
              currency ? 'pl-8' : 'px-3'
            } py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200 ${
              error
                ? 'border-red-300 text-red-900 placeholder-red-300 focus-visible:ring-red-500'
                : 'hover:border-gray-300'
            } ${className}`}
            {...props}
          />
          {required && !error && (
            <VisuallyHidden aria-live="polite">{label} is required</VisuallyHidden>
          )}
        </div>
        {error && (
          <p
            id={errorId}
            className="text-sm font-medium text-red-600"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
