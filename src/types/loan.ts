export interface PersonalInformation {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface ContactDetails {
  email: string;
  phone: string;
}

export interface LoanRequest {
  loanAmount: number;
  upfrontPayment: number;
  terms: number;
}

export interface FinancialInformation {
  monthlySalary: number;
  hasAdditionalIncome: boolean;
  additionalIncome?: number;
  hasMortgage: boolean;
  mortgage?: number;
  hasOtherCredits: boolean;
  otherCredits?: number;
}

export interface LoanApplication
  extends PersonalInformation,
    ContactDetails,
    LoanRequest,
    FinancialInformation {
  id?: string;
  confirmed: boolean;
}

export type Step = 1 | 2 | 3 | 4 | 5;
