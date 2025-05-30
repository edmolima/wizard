import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormStep } from '../components/FormStep';
import { FormInput } from '../components/FormInput';
import { financialInformationSchema } from '../lib/schemas';
import type { FinancialInformation } from '../types/loan';
import { useLoanForm } from '../hooks/useLoanForm';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function formatNumber(value: number | string) {
  if (value === '' || value === undefined || value === null) return '';
  const num = typeof value === 'number' ? value : Number(String(value).replace(/[^\d]/g, ''));
  if (isNaN(num)) return '';
  return num.toLocaleString('en-US');
}

function parseNumber(value: string) {
  if (!value) return undefined;
  const num = Number(value.replace(/[^\d]/g, ''));
  return isNaN(num) ? undefined : num;
}

export function FinancialInformationStep() {
  const navigate = useNavigate();
  const { formData, isSubmitting, error, submitStep } = useLoanForm();
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
    watch,
    setError,
  } = useForm<FinancialInformation>({
    resolver: zodResolver(financialInformationSchema),
    defaultValues: formData as FinancialInformation,
    mode: 'onChange',
  });

  // Local state for formatted values
  const [monthlySalaryDisplay, setMonthlySalaryDisplay] = useState(() =>
    formatNumber(formData.monthlySalary ?? '')
  );
  const [additionalIncomeDisplay, setAdditionalIncomeDisplay] = useState(() =>
    formatNumber(formData.additionalIncome ?? '')
  );
  const [mortgageDisplay, setMortgageDisplay] = useState(() =>
    formatNumber(formData.mortgage ?? '')
  );
  const [otherCreditsDisplay, setOtherCreditsDisplay] = useState(() =>
    formatNumber(formData.otherCredits ?? '')
  );

  const hasAdditionalIncome = watch('hasAdditionalIncome');
  const hasMortgage = watch('hasMortgage');
  const hasOtherCredits = watch('hasOtherCredits');

  const onSubmit = handleSubmit(async (data) => {
    // Calculate if the loan is affordable
    const monthlyIncome =
      (parseNumber(monthlySalaryDisplay) ?? 0) + (parseNumber(additionalIncomeDisplay) ?? 0);
    const monthlyExpenses =
      (parseNumber(mortgageDisplay) ?? 0) + (parseNumber(otherCreditsDisplay) ?? 0);
    const monthlyPayment = (formData.loanAmount || 0) / (formData.terms || 1);

    if ((monthlyIncome - monthlyExpenses) * 0.5 < monthlyPayment) {
      setError('root', {
        type: 'manual',
        message:
          'Based on your financial information, this loan amount may not be affordable. Please consider reducing the loan amount or starting over with a new application.',
      });
      return;
    }

    await submitStep(4, {
      ...data,
      monthlySalary: parseNumber(monthlySalaryDisplay),
      additionalIncome: parseNumber(additionalIncomeDisplay),
      mortgage: parseNumber(mortgageDisplay),
      otherCredits: parseNumber(otherCreditsDisplay),
    });
  });

  // Handlers for masked inputs
  function handleMonthlySalaryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatNumber(e.target.value);
    setMonthlySalaryDisplay(formatted);
    const parsed = parseNumber(formatted);
    setValue('monthlySalary', parsed ?? 0, { shouldValidate: true });
  }

  function handleAdditionalIncomeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatNumber(e.target.value);
    setAdditionalIncomeDisplay(formatted);
    const parsed = parseNumber(formatted);
    setValue('additionalIncome', parsed ?? 0, { shouldValidate: true });
  }

  function handleMortgageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatNumber(e.target.value);
    setMortgageDisplay(formatted);
    const parsed = parseNumber(formatted);
    setValue('mortgage', parsed ?? 0, { shouldValidate: true });
  }

  function handleOtherCreditsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatNumber(e.target.value);
    setOtherCreditsDisplay(formatted);
    const parsed = parseNumber(formatted);
    setValue('otherCredits', parsed ?? 0, { shouldValidate: true });
  }

  const handleReduceLoanAmount = () => {
    navigate('/loan-application/step3');
  };

  const handleStartOver = () => {
    navigate('/loan-application/step1');
  };

  return (
    <FormStep
      title="Financial Information"
      description="Please provide your financial details to help us assess your loan application."
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      error={error ?? undefined}
      showBackButton={true}
      onBack={() => navigate('/loan-application/step3')}
    >
      <FormInput
        id="monthlySalary"
        type="text"
        label="Monthly Salary (€)"
        error={errors.monthlySalary?.message}
        min={0}
        step={100}
        placeholder="e.g. 3,500"
        description="Your main monthly income in euro (€)"
        currency={true}
        value={monthlySalaryDisplay}
        onChange={handleMonthlySalaryChange}
        inputMode="numeric"
        autoComplete="off"
        required
      />

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasAdditionalIncome"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            {...register('hasAdditionalIncome')}
          />
          <label htmlFor="hasAdditionalIncome" className="ml-2 block text-sm text-gray-900">
            I have additional monthly income
          </label>
        </div>

        {hasAdditionalIncome && (
          <FormInput
            id="additionalIncome"
            type="text"
            label="Additional Monthly Income (€)"
            error={errors.additionalIncome?.message}
            min={0}
            step={100}
            placeholder="e.g. 800"
            description="Any additional monthly income in euro (€)"
            currency={true}
            value={additionalIncomeDisplay}
            onChange={handleAdditionalIncomeChange}
            inputMode="numeric"
            autoComplete="off"
            required
          />
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasMortgage"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            {...register('hasMortgage')}
          />
          <label htmlFor="hasMortgage" className="ml-2 block text-sm text-gray-900">
            I have a mortgage payment
          </label>
        </div>

        {hasMortgage && (
          <FormInput
            id="mortgage"
            type="text"
            label="Monthly Mortgage Payment (€)"
            error={errors.mortgage?.message}
            min={0}
            step={100}
            placeholder="e.g. 1,200"
            description="Your monthly mortgage payment in euro (€)"
            currency={true}
            value={mortgageDisplay}
            onChange={handleMortgageChange}
            inputMode="numeric"
            autoComplete="off"
            required
          />
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasOtherCredits"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            {...register('hasOtherCredits')}
          />
          <label htmlFor="hasOtherCredits" className="ml-2 block text-sm text-gray-900">
            I have other monthly credit payments
          </label>
        </div>

        {hasOtherCredits && (
          <FormInput
            id="otherCredits"
            type="text"
            label="Other Monthly Credit Payments (€)"
            error={errors.otherCredits?.message}
            min={0}
            step={100}
            placeholder="e.g. 300"
            description="Other monthly credit payments in euro (€)"
            currency={true}
            value={otherCreditsDisplay}
            onChange={handleOtherCreditsChange}
            inputMode="numeric"
            autoComplete="off"
            required
          />
        )}
      </div>

      {errors.root && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Financial Validation Failed</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{errors.root.message}</p>
              </div>
              <div className="mt-4 flex space-x-4">
                <button
                  type="button"
                  onClick={handleReduceLoanAmount}
                  className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Reduce Loan Amount
                </button>
                <button
                  type="button"
                  onClick={handleStartOver}
                  className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Start New Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </FormStep>
  );
}
