export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum Category {
  SALARY = 'Salário',
  FREELANCE = 'Freelance',
  INVESTMENT = 'Investimentos',
  FOOD = 'Alimentação',
  HOUSING = 'Moradia',
  TRANSPORT = 'Transporte',
  ENTERTAINMENT = 'Lazer',
  HEALTH = 'Saúde',
  EDUCATION = 'Educação',
  SHOPPING = 'Compras',
  OTHERS = 'Outros',
}

export enum PaymentMethod {
  CASH = 'Dinheiro/Débito',
  CREDIT_CARD = 'Cartão de Crédito',
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  paymentMethod: PaymentMethod;
  date: string;
}

export interface FinancialAdvice {
  healthScore: number;
  summary: string;
  actionableTips: string[];
  budgetAlerts: string[];
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}