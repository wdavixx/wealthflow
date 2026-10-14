/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Transaction {
  id: string;
  title: string;
  category: string;
  type: 'expense' | 'income';
  amount: number;
  date: string; // ISO date string or human readable date like "2026-06-30"
  paymentMethod: string; // "Debit Card" | "Credit Card" | "Direct Deposit" | "Cash"
  note?: string;
}

export interface Debt {
  id: string;
  creditor: string;
  type: string; // "Cartão de Crédito" | "Internet" | "Parcelamento"
  originalAmount: number;
  currentAmount: number;
  suggestedAmount: number;
  daysOverdue: number;
  interestRate: number; // monthly interest rate in % e.g. 12.5
  status: 'negative' | 'negotiated' | 'paid';
}

export interface Budget {
  id: string;
  category: string; // "Alimentação" | "Transporte" | "Lazer"
  namePt: string;
  nameEn: string;
  currentSpent: number;
  targetLimit: number;
  iconName: string; // "restaurant" | "commute" | "movie" | "home"
}

export interface AIStrategyReport {
  summary: string;
  order: string[];
  tips: string[];
}
