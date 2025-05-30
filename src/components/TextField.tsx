import { forwardRef } from 'react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, name, error, ...props }, ref) => {
    return (
      <div>
        <label htmlFor={name}>
          {label}
          {props.required && <span aria-hidden="true"> *</span>}
        </label>
        <input
          ref={ref}
          id={name}
          name={name}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />
        {error && (
          <div id={`${name}-error`} role="alert">
            {error}
          </div>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';
