import { Transaction, TransactionType, Category, PaymentMethod } from "../types";

const STORAGE_KEY = "financas_ai_transactions";

const DUMMY_DATA: Transaction[] = [
  { id: "1", description: "Salário Mensal", amount: 5000, type: TransactionType.INCOME, category: Category.SALARY, paymentMethod: PaymentMethod.CASH, date: new Date().toISOString() },
  { id: "2", description: "Supermercado Semanal", amount: 450.50, type: TransactionType.EXPENSE, category: Category.FOOD, paymentMethod: PaymentMethod.CASH, date: new Date(Date.now() - 86400000).toISOString() },
  { id: "3", description: "Aluguel", amount: 1800, type: TransactionType.EXPENSE, category: Category.HOUSING, paymentMethod: PaymentMethod.CASH, date: new Date(Date.now() - 172800000).toISOString() },
  { id: "4", description: "Freelance Projeto Web", amount: 1200, type: TransactionType.INCOME, category: Category.FREELANCE, paymentMethod: PaymentMethod.CASH, date: new Date(Date.now() - 259200000).toISOString() },
  { id: "5", description: "Jantar Fora", amount: 120, type: TransactionType.EXPENSE, category: Category.ENTERTAINMENT, paymentMethod: PaymentMethod.CREDIT_CARD, date: new Date(Date.now() - 345600000).toISOString() },
  { id: "6", description: "Eletrônicos", amount: 800, type: TransactionType.EXPENSE, category: Category.SHOPPING, paymentMethod: PaymentMethod.CREDIT_CARD, date: new Date().toISOString() },
];

export const getStoredTransactions = (): Transaction[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Initialize with dummy data for better UX on first load
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DUMMY_DATA));
    return DUMMY_DATA;
  }
  
  // Migration for existing data that might not have paymentMethod
  const parsed = JSON.parse(stored);
  return parsed.map((t: any) => ({
    ...t,
    paymentMethod: t.paymentMethod || PaymentMethod.CASH
  }));
};

export const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};