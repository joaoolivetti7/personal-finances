import React from 'react';
import { Transaction, TransactionType, PaymentMethod } from '../types';
import { ArrowUpCircle, ArrowDownCircle, Wallet, CreditCard } from 'lucide-react';

interface Props {
  transactions: Transaction[];
}

const SummaryCards: React.FC<Props> = ({ transactions }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const income = transactions
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = income - expense;

  // Credit Card Invoice (Current Month expenses on Credit Card)
  const creditCardInvoice = transactions
    .filter((t) => {
      const tDate = new Date(t.date);
      return (
        t.type === TransactionType.EXPENSE &&
        t.paymentMethod === PaymentMethod.CREDIT_CARD &&
        tDate.getMonth() === currentMonth &&
        tDate.getFullYear() === currentYear
      );
    })
    .reduce((acc, curr) => acc + curr.amount, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors duration-300">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Saldo Total</p>
          <h3 className={`text-2xl font-bold ${balance >= 0 ? 'text-slate-800 dark:text-white' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(balance)}
          </h3>
        </div>
        <div className="p-3 bg-brand-50 dark:bg-brand-900/30 rounded-full text-brand-600 dark:text-brand-400">
          <Wallet size={24} />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors duration-300">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Receitas</p>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(income)}</h3>
        </div>
        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400">
          <ArrowUpCircle size={24} />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors duration-300">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Despesas Totais</p>
          <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400">{formatCurrency(expense)}</h3>
        </div>
        <div className="p-3 bg-rose-50 dark:bg-rose-900/30 rounded-full text-rose-600 dark:text-rose-400">
          <ArrowDownCircle size={24} />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between relative overflow-hidden transition-colors duration-300">
        <div className="relative z-10">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Fatura Cartão (Mês)</p>
          <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(creditCardInvoice)}</h3>
        </div>
        <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400 relative z-10">
          <CreditCard size={24} />
        </div>
        {/* Decorative element */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-50 dark:bg-purple-900/10 rounded-full opacity-50"></div>
      </div>
    </div>
  );
};

export default SummaryCards;