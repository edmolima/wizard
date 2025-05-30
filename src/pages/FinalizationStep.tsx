import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormStep } from '../components/FormStep';
import { finalizationSchema } from '../lib/schemas';
import type { LoanApplication } from '../types/loan';
import { useLoanForm } from '../hooks/useLoanForm';
import { useNavigate } from 'react-router-dom';

interface FinalizationData {
  confirmed: boolean;
}

export function FinalizationStep() {
  const navigate = useNavigate();
  const { formData, isSubmitting, error, submitStep } = useLoanForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FinalizationData>({
    resolver: zodResolver(finalizationSchema),
    defaultValues: { confirmed: false },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await submitStep(5, { ...formData, ...data } as LoanApplication);
      navigate('/loan-application/success');
    } catch {
      // Error is already handled by submitStep
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <FormStep
      title="Review and Confirm"
      description="Please review your loan application details and confirm to submit."
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      error={error?.toString()}
      submitLabel="Finish"
    >
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
          <dl className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Full Name</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.firstName} {formData.lastName}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.dateOfBirth && formatDate(formData.dateOfBirth)}
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <h3 className="text-lg font-medium text-gray-900">Contact Details</h3>
          <dl className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.phone}</dd>
            </div>
          </dl>
        </section>

        <section>
          <h3 className="text-lg font-medium text-gray-900">Loan Request</h3>
          <dl className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Loan Amount</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.loanAmount && formatCurrency(formData.loanAmount)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Upfront Payment</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.upfrontPayment && formatCurrency(formData.upfrontPayment)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Terms</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.terms} months</dd>
            </div>
          </dl>
        </section>

        <section>
          <h3 className="text-lg font-medium text-gray-900">Financial Information</h3>
          <dl className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Monthly Salary</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.monthlySalary && formatCurrency(formData.monthlySalary)}
              </dd>
            </div>
            {formData.hasAdditionalIncome && formData.additionalIncome && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Additional Income</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatCurrency(formData.additionalIncome)}
                </dd>
              </div>
            )}
            {formData.hasMortgage && formData.mortgage && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Mortgage Payment</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatCurrency(formData.mortgage)}</dd>
              </div>
            )}
            {formData.hasOtherCredits && formData.otherCredits && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Other Credit Payments</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatCurrency(formData.otherCredits)}
                </dd>
              </div>
            )}
          </dl>
        </section>

        <div className="mt-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="confirmed"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              {...register('confirmed')}
            />
            <label htmlFor="confirmed" className="ml-2 block text-sm text-gray-900">
              I confirm that all the information provided is accurate and complete
            </label>
          </div>
          {errors.confirmed && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {errors.confirmed.message}
            </p>
          )}
        </div>
      </div>
    </FormStep>
  );
}
