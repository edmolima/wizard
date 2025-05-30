import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../test-utils';
import { FormStep } from './FormStep';

describe('FormStep', () => {
  const defaultProps = {
    title: 'Test Step',
    onSubmit: vi.fn(),
  };

  it('renders with basic props', () => {
    render(<FormStep {...defaultProps}>Form content</FormStep>);

    expect(screen.getByRole('heading')).toHaveTextContent('Test Step');
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Continue');
  });

  it('renders description when provided', () => {
    const description = 'Step description';
    render(
      <FormStep {...defaultProps} description={description}>
        Form content
      </FormStep>
    );

    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByRole('form')).toHaveAttribute(
      'aria-describedby',
      'form-test-step-description'
    );
  });

  it('renders error message when provided', () => {
    const error = 'Error message';
    render(
      <FormStep {...defaultProps} error={error}>
        Form content
      </FormStep>
    );

    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toHaveTextContent(error);
    expect(errorAlert).toHaveAttribute('aria-live', 'assertive');
  });

  it('calls onSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <FormStep {...defaultProps} onSubmit={onSubmit}>
        Form content
      </FormStep>
    );

    await user.click(screen.getByRole('button'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('disables submit button and shows loading state when isSubmitting is true', () => {
    render(
      <FormStep {...defaultProps} isSubmitting>
        Form content
      </FormStep>
    );

    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Processing')).toBeInTheDocument();
  });

  it('renders back button when showBackButton and onBack are provided', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(
      <FormStep {...defaultProps} showBackButton onBack={onBack}>
        Form content
      </FormStep>
    );

    const backButton = screen.getByRole('button', { name: 'Back' });
    expect(backButton).toBeInTheDocument();

    await user.click(backButton);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('uses custom submit label when provided', () => {
    const submitLabel = 'Save and Continue';
    render(
      <FormStep {...defaultProps} submitLabel={submitLabel}>
        Form content
      </FormStep>
    );

    expect(screen.getByRole('button')).toHaveTextContent(submitLabel);
  });

  it('renders children in a group with proper ARIA attributes', () => {
    render(
      <FormStep {...defaultProps}>
        <div>Field 1</div>
        <div>Field 2</div>
      </FormStep>
    );

    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-labelledby', 'form-test-step-fields-title');
    expect(screen.getByText('Field 1')).toBeInTheDocument();
    expect(screen.getByText('Field 2')).toBeInTheDocument();
  });

  it('generates unique form ID based on title', () => {
    render(<FormStep {...defaultProps}>Form content</FormStep>);

    const form = screen.getByRole('form');
    expect(form).toHaveAttribute('id', 'form-test-step');
    expect(form).toHaveAttribute('aria-labelledby', 'form-test-step-title');
  });
});
