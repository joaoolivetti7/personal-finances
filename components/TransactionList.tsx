import React from 'react';
import { Transaction, TransactionType, PaymentMethod } from '../types';
import { Trash2, CreditCard, Banknote } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<Props> = ({ transactions, onDelete }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  // Sort by date desc
  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-semibold text-slate-700">Histórico Recente</h3>
      </div>
      <div className="overflow-y-auto max-h-[500px] p-0">
        {sorted.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            Nenhuma transação registrada.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium hidden sm:table-header-group">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Descrição</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3 text-right">Valor</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 group transition-colors">
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap block sm:table-cell">
                    <span className="sm:hidden font-bold mr-2">Data:</span>
                    {formatDate(t.date)}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800 block sm:table-cell">
                    <div className="flex items-center gap-2">
                        {t.type === TransactionType.EXPENSE && t.paymentMethod === PaymentMethod.CREDIT_CARD ? (
                            <CreditCard size={14} className="text-purple-500 flex-shrink-0" title="Cartão de Crédito" />
                        ) : t.type === TransactionType.EXPENSE ? (
                             <Banknote size={14} className="text-slate-400 flex-shrink-0" title="Dinheiro/Débito" />
                        ) : null}
                        {t.description}
                    </div>
                  </td>
                  <td className="px-4 py-3 block sm:table-cell">
                    <span className="inline-block px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                      {t.category}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold block sm:table-cell ${
                    t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                     <span className="sm:hidden text-slate-400 mr-2 font-normal">Valor:</span>
                    {t.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-4 py-3 text-right block sm:table-cell border-b sm:border-none">
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                      title="Remover"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionList;