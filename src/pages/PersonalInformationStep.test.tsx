import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PersonalInformationStep } from './PersonalInformationStep';
import { useLoanForm } from '../hooks/useLoanForm';

vi.mock('../hooks/useLoanForm');

const mockUseLoanForm = vi.mocked(useLoanForm);

describe('PersonalInformationStep', () => {
  const mockUpdateFormData = vi.fn();
  const mockSubmitStep = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLoanForm.mockReturnValue({
      formData: {},
      isSubmitting: false,
      error: null,
      updateFormData: mockUpdateFormData,
      submitStep: mockSubmitStep,
      resetForm: vi.fn(),
    });
  });

  it('renders form with all required fields', () => {
    render(<PersonalInformationStep />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
  });

  it('updates form data when fields are filled', async () => {
    const user = userEvent.setup();
    render(<PersonalInformationStep />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const dateOfBirthInput = screen.getByLabelText(/date of birth/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(dateOfBirthInput, '1990-01-01');
    await user.click(submitButton);

    expect(mockSubmitStep).toHaveBeenCalledWith(1, {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
    });
  });

  it('shows validation errors when required fields are empty', async () => {
    const user = userEvent.setup();
    render(<PersonalInformationStep />);

    const submitButton = screen.getByRole('button', { name: /continue/i });
    await user.click(submitButton);

    expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/maximum age allowed is 79 years/i)).toBeInTheDocument();
  });

  it('shows loading state during submission', async () => {
    mockUseLoanForm.mockReturnValue({
      formData: {},
      isSubmitting: true,
      error: null,
      updateFormData: mockUpdateFormData,
      submitStep: mockSubmitStep,
      resetForm: vi.fn(),
    });

    render(<PersonalInformationStep />);

    const submitButton = screen.getByRole('button', { name: /processing/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute('aria-busy', 'true');
  });

  it('shows error message when submission fails', () => {
    mockUseLoanForm.mockReturnValue({
      formData: {},
      isSubmitting: false,
      error: 'Failed to submit form',
      updateFormData: mockUpdateFormData,
      submitStep: mockSubmitStep,
      resetForm: vi.fn(),
    });

    render(<PersonalInformationStep />);

    expect(screen.getByText('Failed to submit form')).toBeInTheDocument();
  });

  it('pre-fills form with existing data', () => {
    mockUseLoanForm.mockReturnValue({
      formData: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
      },
      isSubmitting: false,
      error: null,
      updateFormData: mockUpdateFormData,
      submitStep: mockSubmitStep,
      resetForm: vi.fn(),
    });

    render(<PersonalInformationStep />);

    expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
    expect(screen.getByLabelText(/date of birth/i)).toHaveValue('1990-01-01');
  });
});
