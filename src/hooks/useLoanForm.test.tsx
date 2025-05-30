import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLoanForm } from './useLoanForm';
import { loanService } from '../services/api';
import type { LoanApplication } from '../types/loan';

// Mock dependencies
vi.mock('../services/api');
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useLoanForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('initializes with empty form data when no saved data exists', () => {
    const { result } = renderHook(() => useLoanForm());

    expect(result.current.formData).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('loads saved form data from localStorage on initialization', () => {
    const savedData = {
      firstName: 'John',
      lastName: 'Doe',
    };
    localStorage.setItem('loan-application-data', JSON.stringify(savedData));

    const { result } = renderHook(() => useLoanForm());

    expect(result.current.formData).toEqual(savedData);
  });

  it('updates form data and saves to localStorage', () => {
    const { result } = renderHook(() => useLoanForm());
    const newData = { firstName: 'Jane' };

    act(() => {
      result.current.updateFormData(newData);
    });

    expect(result.current.formData).toEqual(newData);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'loan-application-data',
      JSON.stringify(newData)
    );
  });

  it('submits form data successfully', async () => {
    const mockApplication: LoanApplication = {
      ...defaultFormData,
      id: '123',
    };
    vi.mocked(loanService.create).mockResolvedValueOnce(mockApplication);

    const { result } = renderHook(() => useLoanForm());

    await act(async () => {
      await result.current.submitStep(1, defaultFormData);
    });

    expect(result.current.formData).toEqual(mockApplication);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles submission errors', async () => {
    const error = new Error('Submission failed');
    vi.mocked(loanService.create).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useLoanForm());

    await act(async () => {
      await result.current.submitStep(1, defaultFormData);
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBe('Submission failed');
  });

  it('updates existing application', async () => {
    const mockApplication: LoanApplication = {
      ...defaultFormData,
      id: '123',
    };
    vi.mocked(loanService.update).mockResolvedValueOnce(mockApplication);

    const { result } = renderHook(() => useLoanForm());

    act(() => {
      result.current.updateFormData({ id: '123' });
    });

    await act(async () => {
      await result.current.submitStep(1, defaultFormData);
    });

    expect(loanService.update).toHaveBeenCalledWith('123', mockApplication);
  });

  it('resets form data and clears localStorage', () => {
    const { result } = renderHook(() => useLoanForm());

    act(() => {
      result.current.updateFormData(defaultFormData);
      result.current.resetForm();
    });

    expect(result.current.formData).toEqual({});
    expect(localStorage.removeItem).toHaveBeenCalledWith('loan-application-data');
  });
});

const defaultFormData: Omit<LoanApplication, 'id'> = {
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  email: 'john@example.com',
  phone: '1234567890',
  loanAmount: 10000,
  upfrontPayment: 1000,
  terms: 12,
  monthlySalary: 5000,
  hasAdditionalIncome: false,
  hasMortgage: false,
  hasOtherCredits: false,
  confirmed: false,
};
