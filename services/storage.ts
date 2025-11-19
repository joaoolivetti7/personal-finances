import { Transaction, TransactionType, Category, PaymentMethod } from "../types";

const STORAGE_KEY = "financas_ai_transactions";

const DUMMY_DATA: Transaction[] = [

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