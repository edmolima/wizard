import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormStep } from '../components/FormStep';
import { FormInput } from '../components/FormInput';
import { loanRequestSchema } from '../lib/schemas';
import type { LoanRequest } from '../types/loan';
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

export function LoanRequestStep() {
  const navigate = useNavigate();
  const { formData, isSubmitting, error, submitStep } = useLoanForm();
  const {
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<LoanRequest>({
    resolver: zodResolver(loanRequestSchema),
    defaultValues: formData as LoanRequest,
    mode: 'onChange',
  });

  // Local state for formatted values
  const [loanAmountDisplay, setLoanAmountDisplay] = useState(() =>
    formatNumber(formData.loanAmount ?? '')
  );
  const [upfrontPaymentDisplay, setUpfrontPaymentDisplay] = useState(() =>
    formatNumber(formData.upfrontPayment ?? '')
  );
  const [termsDisplay, setTermsDisplay] = useState(() => formData.terms?.toString() ?? '');

  const terms = watch('terms');

  const onSubmit = handleSubmit(async (data) => {
    const parsedLoanAmount = parseNumber(loanAmountDisplay);
    const parsedUpfrontPayment = parseNumber(upfrontPaymentDisplay);
    const parsedTerms = termsDisplay ? Number(termsDisplay) : 0;
    await submitStep(3, {
      ...formData,
      ...data,
      loanAmount: parsedLoanAmount,
      upfrontPayment: parsedUpfrontPayment,
      terms: parsedTerms,
    });
  });

  // Handlers for masked inputs
  function handleLoanAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatNumber(e.target.value);
    setLoanAmountDisplay(formatted);
    const parsed = parseNumber(formatted);
    setValue('loanAmount', parsed ?? 0, { shouldValidate: true });
  }

  function handleUpfrontPaymentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatNumber(e.target.value);
    setUpfrontPaymentDisplay(formatted);
    const parsed = parseNumber(formatted);
    setValue('upfrontPayment', parsed ?? 0, { shouldValidate: true });
  }

  function handleTermsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTermsDisplay(value);
    const num = value === '' ? 0 : Number(value);
    setValue('terms', num, { shouldValidate: true });
  }

  // Safe calculation for estimate
  const parsedLoanAmount = parseNumber(loanAmountDisplay) ?? 0;
  const parsedUpfrontPayment = parseNumber(upfrontPaymentDisplay) ?? 0;
  const parsedTerms = typeof terms === 'number' ? terms : Number(terms);
  const isValidTerms = parsedTerms >= 10 && parsedTerms <= 30;
  const canEstimate =
    parsedLoanAmount > 0 && isValidTerms && parsedLoanAmount > parsedUpfrontPayment;
  const monthlyEstimate = canEstimate
    ? ((parsedLoanAmount - parsedUpfrontPayment) / parsedTerms).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '--';

  return (
    <FormStep
      title="Loan Request"
      description="Please provide the details of your loan request."
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      error={error ?? undefined}
      showBackButton={true}
      onBack={() => navigate('/loan-application/step2')}
    >
      <FormInput
        id="loanAmount"
        type="text"
        label="Loan Amount (€)"
        error={errors.loanAmount?.message ?? undefined}
        description="Amount between €10,000 and €70,000"
        min={10000}
        max={70000}
        step={1000}
        placeholder="e.g. 25,000"
        currency={true}
        value={loanAmountDisplay}
        onChange={handleLoanAmountChange}
        inputMode="numeric"
        autoComplete="off"
        required
      />

      <FormInput
        id="upfrontPayment"
        type="text"
        label="Upfront Payment (€)"
        error={errors.upfrontPayment?.message ?? undefined}
        description={`Maximum upfront payment: €${formatNumber(parsedLoanAmount - 1)}`}
        min={0}
        max={parsedLoanAmount ? parsedLoanAmount - 1 : 69999}
        step={1000}
        placeholder="e.g. 5,000"
        currency={true}
        value={upfrontPaymentDisplay}
        onChange={handleUpfrontPaymentChange}
        inputMode="numeric"
        autoComplete="off"
        required
      />

      <FormInput
        id="terms"
        type="text"
        label="Loan Terms (months)"
        error={errors.terms?.message ?? undefined}
        description="Enter a number between 10 and 30 months"
        placeholder="e.g. 24"
        inputMode="numeric"
        autoComplete="off"
        value={termsDisplay}
        onChange={handleTermsChange}
        required
        onKeyDown={(e) => {
          if (
            !/[\d]/.test(e.key) &&
            !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
          ) {
            e.preventDefault();
          }
        }}
      />

      {canEstimate && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">Monthly payment estimate: € {monthlyEstimate}</p>
        </div>
      )}
    </FormStep>
  );
}
