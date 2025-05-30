import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoanApplication } from '../types/loan';
import { loanService } from '../services/api';

const STORAGE_KEY = 'loan-application-data';

export function useLoanForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<LoanApplication>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (data: Partial<LoanApplication>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const submitStep = async (step: number, data: Partial<LoanApplication>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const mergedData = { ...formData, ...data };
      if (formData.id) {
        await loanService.update(formData.id, mergedData);
      } else {
        const newApplication = await loanService.create({
          ...mergedData,
          confirmed: false,
        } as Omit<LoanApplication, 'id'>);
        setFormData((prev) => ({ ...prev, id: newApplication.id }));
      }

      updateFormData(data);
      navigate(`/loan-application/step${step + 1}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({});
    localStorage.removeItem(STORAGE_KEY);
    navigate('/loan-application/step1');
  };

  return {
    formData,
    isSubmitting,
    error,
    updateFormData,
    submitStep,
    resetForm,
  };
}
