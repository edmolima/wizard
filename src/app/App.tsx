import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { PersonalInformationStep } from '../pages/PersonalInformationStep';
import { ContactDetailsStep } from '../pages/ContactDetailsStep';
import { LoanRequestStep } from '../pages/LoanRequestStep';
import { FinancialInformationStep } from '../pages/FinancialInformationStep';
import { FinalizationStep } from '../pages/FinalizationStep';
import { SuccessStep } from '../pages/SuccessStep';
import { StepGuard } from '../components/StepGuard';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/loan-application/step1" replace />} />
        <Route
          path="/loan-application"
          element={<Navigate to="/loan-application/step1" replace />}
        />
        <Route
          path="/loan-application/step1"
          element={
            <Layout>
              <StepGuard>
                <PersonalInformationStep />
              </StepGuard>
            </Layout>
          }
        />
        <Route
          path="/loan-application/step2"
          element={
            <Layout>
              <StepGuard>
                <ContactDetailsStep />
              </StepGuard>
            </Layout>
          }
        />
        <Route
          path="/loan-application/step3"
          element={
            <Layout>
              <StepGuard>
                <LoanRequestStep />
              </StepGuard>
            </Layout>
          }
        />
        <Route
          path="/loan-application/step4"
          element={
            <Layout>
              <StepGuard>
                <FinancialInformationStep />
              </StepGuard>
            </Layout>
          }
        />
        <Route
          path="/loan-application/step5"
          element={
            <Layout>
              <StepGuard>
                <FinalizationStep />
              </StepGuard>
            </Layout>
          }
        />
        <Route
          path="/loan-application/success"
          element={
            <Layout>
              <StepGuard>
                <SuccessStep />
              </StepGuard>
            </Layout>
          }
        />
        <Route
          path="/loan-application/*"
          element={<Navigate to="/loan-application/step1" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
