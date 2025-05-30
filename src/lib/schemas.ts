import { z } from 'zod';

const latinAndGermanLetters = /^[a-zA-ZäöüßÄÖÜ\s-]+$/;

// Schema base que será estendido por outros schemas
const baseSchema = z.object({
  uuid: z.string().optional(),
});

export const personalInformationSchema = baseSchema.extend({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .regex(latinAndGermanLetters, 'Only Latin and German letters are allowed')
    .refine((name) => !name.includes(' '), 'Only a single name is allowed'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .regex(latinAndGermanLetters, 'Only Latin and German letters are allowed'),
  dateOfBirth: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 < 79;
    }
    return age < 79;
  }, 'Maximum age allowed is 79 years'),
});

export const contactDetailsSchema = baseSchema.extend({
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Phone must be in E.164 format (e.g., +1234567890)'),
});

export const loanRequestSchema = baseSchema
  .extend({
    loanAmount: z
      .number()
      .min(10000, 'Loan amount must be at least €10,000')
      .max(70000, 'Loan amount cannot exceed €70,000'),
    upfrontPayment: z.number().min(0, 'Upfront payment cannot be negative'),
    terms: z
      .number({
        required_error: 'Loan terms is required',
        invalid_type_error: 'Please enter a valid number of months',
      })
      .refine((value) => Number.isInteger(value), {
        message: 'Please enter a whole number of months',
      })
      .refine((value) => value >= 10 && value <= 30, {
        message: 'Loan terms must be between 10 and 30 months',
      }),
  })
  .superRefine((data, ctx) => {
    if (data.upfrontPayment >= data.loanAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Upfront payment must be less than the loan amount',
        path: ['upfrontPayment'],
      });
    }
  });

export const financialInformationSchema = baseSchema
  .extend({
    monthlySalary: z.number().min(0, 'Monthly salary is required'),
    hasAdditionalIncome: z.boolean(),
    additionalIncome: z.number().optional(),
    hasMortgage: z.boolean(),
    mortgage: z.number().optional(),
    hasOtherCredits: z.boolean(),
    otherCredits: z.number().optional(),
  })
  .refine(
    (data) => {
      if (data.hasAdditionalIncome && !data.additionalIncome) return false;
      if (data.hasMortgage && !data.mortgage) return false;
      if (data.hasOtherCredits && !data.otherCredits) return false;
      return true;
    },
    {
      message: 'Please fill in all marked financial fields',
      path: ['additionalIncome'],
    }
  );

export const finalizationSchema = baseSchema.extend({
  confirmed: z.boolean().refine((val) => val === true, {
    message: 'You must confirm the data to proceed',
  }),
});

// Schema completo que combina todos os outros schemas
export const completeApplicationSchema = z
  .object({
    personalInformation: personalInformationSchema,
    contactDetails: contactDetailsSchema,
    loanRequest: loanRequestSchema,
    financialInformation: financialInformationSchema,
    finalization: finalizationSchema,
  })
  .superRefine((data, ctx) => {
    // Validação da idade + termos
    const birthDate = new Date(data.personalInformation.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const actualAge =
      monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;

    if (data.loanRequest.terms / 12 + actualAge >= 80) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'The combination of loan terms and your age would exceed the maximum allowed age of 80 years',
        path: ['loanRequest', 'terms'],
      });
    }

    // Validação da renda total vs valor do empréstimo
    const additionalIncome = data.financialInformation.hasAdditionalIncome
      ? data.financialInformation.additionalIncome || 0
      : 0;
    const mortgage = data.financialInformation.hasMortgage
      ? data.financialInformation.mortgage || 0
      : 0;
    const otherCredits = data.financialInformation.hasOtherCredits
      ? data.financialInformation.otherCredits || 0
      : 0;

    const monthlyNetIncome =
      data.financialInformation.monthlySalary + additionalIncome - mortgage - otherCredits;

    const minimumRequiredIncome = (data.loanRequest.loanAmount / data.loanRequest.terms) * 2;

    if (monthlyNetIncome < minimumRequiredIncome) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Your monthly net income (${monthlyNetIncome.toFixed(
          2
        )}) is insufficient for the requested loan amount. You need at least ${minimumRequiredIncome.toFixed(
          2
        )} per month. Please reduce the loan amount or increase your income.`,
        path: ['loanRequest', 'loanAmount'],
      });
    }
  });
