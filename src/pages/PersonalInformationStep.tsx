import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormStep } from '../components/FormStep';
import { FormInput } from '../components/FormInput';
import { personalInformationSchema } from '../lib/schemas';
import type { PersonalInformation } from '../types/loan';
import { useLoanForm } from '../hooks/useLoanForm';

export function PersonalInformationStep() {
  const { formData, isSubmitting, error, submitStep } = useLoanForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInformation>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: formData as PersonalInformation,
  });

  const onSubmit = handleSubmit(async (data) => {
    await submitStep(1, data);
  });

  return (
    <FormStep
      title="Personal Information"
      description="Please provide your personal details to begin the loan application process."
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      error={error || undefined}
      showBackButton={false}
    >
      <FormInput
        id="firstName"
        label="First Name"
        error={errors.firstName?.message}
        placeholder="e.g. John"
        required
        {...register('firstName')}
      />

      <FormInput
        id="lastName"
        label="Last Name"
        error={errors.lastName?.message}
        placeholder="e.g. Doe"
        required
        {...register('lastName')}
      />

      <FormInput
        id="dateOfBirth"
        type="date"
        label="Date of Birth"
        error={errors.dateOfBirth?.message}
        placeholder="YYYY-MM-DD"
        required
        {...register('dateOfBirth')}
      />
    </FormStep>
  );
}
