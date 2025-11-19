import React, { useState } from 'react';
import { Category, Transaction, TransactionType, PaymentMethod } from '../types';
import { Plus, X, CreditCard, Banknote } from 'lucide-react';

interface Props {
  onAdd: (transaction: Transaction) => void;
  onClose: () => void;
}

const TransactionForm: React.FC<Props> = ({ onAdd, onClose }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<Category>(Category.FOOD);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      description,
      amount: parseFloat(amount),
      type,
      category,
      paymentMethod: type === TransactionType.INCOME ? PaymentMethod.CASH : paymentMethod,
      date: new Date().toISOString(),
    };

    onAdd(newTransaction);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-800">Nova Transação</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                type === TransactionType.EXPENSE
                  ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-200'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                type === TransactionType.INCOME
                  ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              Receita
            </button>
          </div>

          {type === TransactionType.EXPENSE && (
            <div className="flex gap-2">
               <button
                type="button"
                onClick={() => setPaymentMethod(PaymentMethod.CASH)}
                className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center gap-2 text-sm transition-all ${
                  paymentMethod === PaymentMethod.CASH
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Banknote size={16} />
                Dinheiro/Débito
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod(PaymentMethod.CREDIT_CARD)}
                className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center gap-2 text-sm transition-all ${
                  paymentMethod === PaymentMethod.CREDIT_CARD
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <CreditCard size={16} />
                Cartão Crédito
              </button>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Supermercado, Salário..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-slate-800 bg-white"
            >
              {Object.values(Category).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;