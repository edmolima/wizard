import { Navigate, useLocation } from 'react-router-dom';
import { useLoanForm } from '../hooks/useLoanForm';

interface StepGuardProps {
  children: React.ReactNode;
}

const VALID_ROUTES = [
  '/loan-application/step1',
  '/loan-application/step2',
  '/loan-application/step3',
  '/loan-application/step4',
  '/loan-application/step5',
  '/loan-application/success',
];

export function StepGuard({ children }: StepGuardProps) {
  const location = useLocation();
  const { formData } = useLoanForm();

  // If the route is not in our valid routes list, redirect to step1
  if (!VALID_ROUTES.includes(location.pathname)) {
    return <Navigate to="/loan-application/step1" replace />;
  }

  // If trying to access success page, check if final step is complete
  if (location.pathname === '/loan-application/success') {
    const isStep5Complete = Boolean(
      formData.confirmed &&
        formData.firstName &&
        formData.lastName &&
        formData.dateOfBirth &&
        formData.email &&
        formData.phone &&
        formData.loanAmount &&
        formData.upfrontPayment &&
        formData.terms &&
        formData.monthlySalary
    );

    return isStep5Complete ? <>{children}</> : <Navigate to="/loan-application/step1" replace />;
  }

  // For all other valid routes, allow access
  return <>{children}</>;
}
