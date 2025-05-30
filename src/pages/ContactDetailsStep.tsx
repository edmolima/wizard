import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormStep } from '../components/FormStep';
import { FormInput } from '../components/FormInput';
import { contactDetailsSchema } from '../lib/schemas';
import type { ContactDetails } from '../types/loan';
import { useLoanForm } from '../hooks/useLoanForm';
import { useNavigate } from 'react-router-dom';

export function ContactDetailsStep() {
  const navigate = useNavigate();
  const { formData, isSubmitting, error, submitStep } = useLoanForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactDetails>({
    resolver: zodResolver(contactDetailsSchema),
    defaultValues: formData as ContactDetails,
  });

  const onSubmit = handleSubmit(async (data) => {
    await submitStep(2, data);
  });

  return (
    <FormStep
      title="Contact Details"
      description="Please provide your contact information so we can reach you about your loan application."
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      error={error || undefined}
      showBackButton={true}
      onBack={() => navigate('/loan-application/step1')}
    >
      <FormInput
        id="email"
        type="email"
        label="Email Address"
        error={errors.email?.message}
        description="We'll use this to send you updates about your application."
        placeholder="e.g. john.doe@example.com"
        required
        {...register('email')}
      />

      <FormInput
        id="phone"
        type="tel"
        label="Phone Number"
        error={errors.phone?.message}
        description="Please include the country code (e.g., +1 for US)"
        placeholder="+1 (555) 123-4567"
        required
        {...register('phone')}
      />
    </FormStep>
  );
}
