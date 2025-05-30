import axios, { AxiosError } from 'axios';
import type { LoanApplication } from '../types/loan';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loanService = {
  // Create a new loan application
  create: async (data: Omit<LoanApplication, 'id'>): Promise<LoanApplication> => {
    try {
      const response = await api.post<LoanApplication>('/entities', data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to create loan application: ${error.message}`);
      }
      throw new Error('Failed to create loan application');
    }
  },

  // Get a loan application by ID
  getById: async (id: string): Promise<LoanApplication> => {
    try {
      const response = await api.get<LoanApplication>(`/entities/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to fetch loan application: ${error.message}`);
      }
      throw new Error('Failed to fetch loan application');
    }
  },

  // Update an existing loan application
  update: async (id: string, data: Partial<LoanApplication>): Promise<LoanApplication> => {
    try {
      const response = await api.patch<LoanApplication>(`/entities/${id}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to update loan application: ${error.message}`);
      }
      throw new Error('Failed to update loan application');
    }
  },
};
