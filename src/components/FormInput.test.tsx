import { describe, it, expect } from 'vitest';
import { render, screen } from '../test-utils';
import { FormInput } from './FormInput';

describe('FormInput', () => {
  it('renders correctly with basic props', () => {
    render(<FormInput id="test" label="Name" />);

    const input = screen.getByLabelText('Name');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'test');
  });

  it('shows required field indicator when required is true', () => {
    render(<FormInput id="test" label="Name" required />);

    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('(required)')).toBeInTheDocument();
  });

  it('displays error message when error is provided', () => {
    const errorMessage = 'Invalid field';
    render(<FormInput id="test" label="Name" error={errorMessage} />);

    const error = screen.getByRole('alert');
    expect(error).toHaveTextContent(errorMessage);
    expect(error).toHaveAttribute('aria-live', 'assertive');
  });

  it('shows description when description is provided', () => {
    const description = 'Enter your full name';
    render(<FormInput id="test" label="Name" description={description} />);

    const desc = screen.getByText(description);
    expect(desc).toBeInTheDocument();
    expect(desc).toHaveAttribute('id', 'test-description');
  });

  it('displays currency symbol when currency is true', () => {
    render(<FormInput id="test" label="Amount" currency />);

    expect(screen.getByText('€')).toBeInTheDocument();
    const input = screen.getByLabelText('Amount');
    expect(input).toHaveClass('pl-8');
  });

  it('updates character counter when maxLength is provided', async () => {
    render(<FormInput id="test" label="Name" maxLength={10} value="12345" />);

    const counter = screen.getByTestId('character-counter');
    expect(counter).toHaveTextContent('5/10');
    expect(counter).toHaveClass('text-xs', 'text-gray-500');
  });

  it('applies error classes correctly when there is an error', () => {
    render(<FormInput id="test" label="Name" error="Error" />);

    const input = screen.getByLabelText('Name');
    expect(input).toHaveClass('border-red-300', 'text-red-900');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('allows customization via className', () => {
    render(<FormInput id="test" label="Name" className="custom-class" />);

    expect(screen.getByLabelText('Name')).toHaveClass('custom-class');
  });
});
