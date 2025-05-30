import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { StepGuard } from './StepGuard';
import { useLoanForm } from '../hooks/useLoanForm';

// Mock the hooks
vi.mock('../hooks/useLoanForm');

const mockUseLoanForm = vi.mocked(useLoanForm);

describe('StepGuard', () => {
  const renderWithRouter = (initialRoute: string) => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route
            path="/loan-application/success"
            element={
              <StepGuard>
                <div data-testid="success-content">Success Content</div>
              </StepGuard>
            }
          />
          <Route
            path="/loan-application/step1"
            element={
              <StepGuard>
                <div data-testid="step1-content">Step 1 Content</div>
              </StepGuard>
            }
          />
          <Route
            path="/loan-application/step2"
            element={
              <StepGuard>
                <div data-testid="step2-content">Step 2 Content</div>
              </StepGuard>
            }
          />
          <Route
            path="/loan-application/step3"
            element={
              <StepGuard>
                <div data-testid="step3-content">Step 3 Content</div>
              </StepGuard>
            }
          />
          <Route
            path="/loan-application/step4"
            element={
              <StepGuard>
                <div data-testid="step4-content">Step 4 Content</div>
              </StepGuard>
            }
          />
          <Route
            path="/loan-application/step5"
            element={
              <StepGuard>
                <div data-testid="step5-content">Step 5 Content</div>
              </StepGuard>
            }
          />
          <Route
            path="*"
            element={
              <StepGuard>
                <div data-testid="invalid-content">Invalid Content</div>
              </StepGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLoanForm.mockReturnValue({
      formData: {},
      isSubmitting: false,
      error: null,
      updateFormData: vi.fn(),
      submitStep: vi.fn(),
      resetForm: vi.fn(),
    });
  });

  it('renders children for valid routes', () => {
    renderWithRouter('/loan-application/step1');
    expect(screen.getByTestId('step1-content')).toBeInTheDocument();
  });

  it('redirects to step1 for invalid routes', () => {
    renderWithRouter('/invalid-route');
    expect(screen.getByTestId('step1-content')).toBeInTheDocument();
  });

  it('allows access to success page when all required fields are filled', () => {
    mockUseLoanForm.mockReturnValue({
      formData: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        email: 'john@example.com',
        phone: '+1234567890',
        loanAmount: 50000,
        terms: 24,
        monthlySalary: 5000,
        upfrontPayment: 10000,
        hasAdditionalIncome: false,
        hasMortgage: false,
        hasOtherCredits: false,
        confirmed: true,
      },
      isSubmitting: false,
      error: null,
      updateFormData: vi.fn(),
      submitStep: vi.fn(),
      resetForm: vi.fn(),
    });

    renderWithRouter('/loan-application/success');
    expect(screen.getByTestId('success-content')).toBeInTheDocument();
  });

  it('redirects to step1 when trying to access success page with incomplete form', () => {
    renderWithRouter('/loan-application/success');
    expect(screen.getByTestId('step1-content')).toBeInTheDocument();
  });

  it('allows access to intermediate steps regardless of form state', () => {
    renderWithRouter('/loan-application/step2');
    expect(screen.getByTestId('step2-content')).toBeInTheDocument();
  });
});
