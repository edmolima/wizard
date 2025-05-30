import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from './TextField';

describe('TextField', () => {
  it('renders with label and input', () => {
    render(<TextField label="Username" name="username" />);

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'username');
  });

  it('shows required indicator when required prop is true', () => {
    render(<TextField label="Username" name="username" required />);

    const label = screen.getByText('Username');
    expect(label).toContainHTML('<span aria-hidden="true"> *</span>');
  });

  it('does not show required indicator when required prop is false', () => {
    render(<TextField label="Username" name="username" />);

    const label = screen.getByText('Username');
    expect(label).not.toContainHTML('<span aria-hidden="true"> *</span>');
  });

  it('shows error message when error prop is provided', () => {
    const errorMessage = 'Username is required';
    render(<TextField label="Username" name="username" error={errorMessage} />);

    expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'username-error');
  });

  it('does not show error message when error prop is not provided', () => {
    render(<TextField label="Username" name="username" />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
  });

  it('forwards ref to input element', () => {
    const ref = { current: null };
    render(<TextField label="Username" name="username" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('handles user input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextField label="Username" name="username" onChange={onChange} />);

    await user.type(screen.getByRole('textbox'), 'john');

    expect(onChange).toHaveBeenCalledTimes(4); // One call per character
    expect(screen.getByRole('textbox')).toHaveValue('john');
  });

  it('applies additional props to input element', () => {
    render(
      <TextField
        label="Username"
        name="username"
        placeholder="Enter username"
        type="email"
        disabled
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter username');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toBeDisabled();
  });

  it('maintains accessibility with custom props', () => {
    render(
      <TextField
        label="Username"
        name="username"
        aria-label="Custom label"
        data-testid="custom-input"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-label', 'Custom label');
    expect(input).toHaveAttribute('data-testid', 'custom-input');
  });
});
