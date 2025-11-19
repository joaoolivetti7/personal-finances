import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction, TransactionType } from '../types';

interface Props {
  transactions: Transaction[];
}

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

const CategoryChart: React.FC<Props> = ({ transactions }) => {
  const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE);
  
  const dataMap = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.keys(dataMap).map(key => ({
    name: key,
    value: dataMap[key]
  })).sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 h-full flex items-center justify-center text-slate-400 flex-col gap-2">
        <div className="h-12 w-12 rounded-full bg-slate-100 mb-2" />
        <p>Sem dados de despesas para o gráfico</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 h-full flex flex-col">
      <h3 className="font-semibold text-slate-700 mb-4 px-2">Despesas por Categoria</h3>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
                formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;