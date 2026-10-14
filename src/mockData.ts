/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Transaction, Debt, Budget } from "./types";

export const initialTransactions: Transaction[] = [
  {
    id: "t1",
    title: "Starbucks",
    category: "Alimentação",
    type: "expense",
    amount: 15.50,
    date: "2026-06-30",
    paymentMethod: "Debit Card",
    note: "Café da manhã especial"
  },
  {
    id: "t2",
    title: "Salário Mensal",
    category: "Renda",
    type: "income",
    amount: 4250.00,
    date: "2026-06-30",
    paymentMethod: "Direct Deposit",
    note: "Depósito direto mensal"
  },
  {
    id: "t3",
    title: "Amazon",
    category: "Compras",
    type: "expense",
    amount: 124.90,
    date: "2026-06-29",
    paymentMethod: "Credit Card",
    note: "Itens de escritório e livros"
  },
  {
    id: "t4",
    title: "Serviço de Limpeza",
    category: "Serviços",
    type: "expense",
    amount: 80.00,
    date: "2026-06-29",
    paymentMethod: "Cash",
    note: "Limpeza quinzenal"
  },
  {
    id: "t5",
    title: "Posto Shell",
    category: "Transporte",
    type: "expense",
    amount: 65.00,
    date: "2026-06-29",
    paymentMethod: "Debit Card",
    note: "Abastecimento semanal"
  },
  {
    id: "t6",
    title: "Aluguel",
    category: "Moradia",
    type: "expense",
    amount: 2100.00,
    date: "2026-06-28",
    paymentMethod: "Cash",
    note: "Pagamento do aluguel de Junho"
  }
];

export const initialDebts: Debt[] = [
  {
    id: "d1",
    creditor: "Banco Santander",
    type: "Cartão de Crédito",
    originalAmount: 5230.00,
    currentAmount: 5230.00,
    suggestedAmount: 1830.00, // 65% OFF deal
    daysOverdue: 124,
    interestRate: 12.5,
    status: "negative"
  },
  {
    id: "d2",
    creditor: "Vivo",
    type: "Internet",
    originalAmount: 220.00,
    currentAmount: 220.00,
    suggestedAmount: 150.00,
    daysOverdue: 45,
    interestRate: 4.2,
    status: "negative"
  },
  {
    id: "d3",
    creditor: "Loja de Varejo",
    type: "Parcelamento",
    originalAmount: 3000.00,
    currentAmount: 3000.00,
    suggestedAmount: 1200.00,
    daysOverdue: 210,
    interestRate: 1.8,
    status: "negative"
  }
];

export const initialBudgets: Budget[] = [
  {
    id: "b1",
    category: "Alimentação",
    namePt: "Alimentação",
    nameEn: "Food",
    currentSpent: 800.00,
    targetLimit: 1000.00,
    iconName: "restaurant"
  },
  {
    id: "b2",
    category: "Transporte",
    namePt: "Transporte",
    nameEn: "Transport",
    currentSpent: 200.00,
    targetLimit: 500.00,
    iconName: "commute"
  },
  {
    id: "b3",
    category: "Lazer",
    namePt: "Lazer",
    nameEn: "Entertainment",
    currentSpent: 475.00,
    targetLimit: 500.00,
    iconName: "movie"
  }
];
