import React, { useState } from 'react';
import { Transaction, FinancialAdvice } from '../types';
import { analyzeFinances } from '../services/geminiService';
import { Sparkles, AlertTriangle, CheckCircle, TrendingUp, Loader2 } from 'lucide-react';

interface Props {
  transactions: Transaction[];
}

const AIAdvisor: React.FC<Props> = ({ transactions }) => {
  const [advice, setAdvice] = useState<FinancialAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (transactions.length === 0) {
      setError("Adicione transações para receber uma análise.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeFinances(transactions);
      setAdvice(result);
    } catch (err) {
      setError("Não foi possível conectar ao consultor IA. Verifique sua chave API ou tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="text-yellow-400" />
            Consultor Gemini AI
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            Receba uma análise personalizada de suas finanças em segundos.
          </p>
        </div>
        {!advice && !loading && (
          <button
            onClick={handleAnalyze}
            className="bg-white text-slate-900 hover:bg-slate-100 font-semibold py-2 px-4 rounded-lg transition-colors text-sm flex items-center gap-2"
          >
            <TrendingUp size={16} />
            Analisar Agora
          </button>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="animate-spin text-brand-500 h-10 w-10" />
          <p className="text-slate-300 animate-pulse">Lendo transações e identificando padrões...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg text-sm flex items-center gap-3">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {advice && !loading && (
        <div className="animate-fade-in space-y-6">
          <div className="flex items-center gap-4">
            <div className={`h-16 w-16 rounded-full flex items-center justify-center border-4 text-2xl font-bold ${getScoreColor(advice.healthScore)}`}>
              {advice.healthScore}
            </div>
            <div className="flex-1">
                <h3 className="font-semibold text-lg text-white">Pontuação de Saúde Financeira</h3>
                <p className="text-slate-400 text-sm">Baseado em seus hábitos de gastos e receitas recentes.</p>
            </div>
            <button 
                onClick={handleAnalyze} 
                className="text-xs text-slate-400 hover:text-white underline"
            >
                Atualizar
            </button>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h4 className="font-medium text-brand-300 mb-2">Resumo</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{advice.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
              <h4 className="font-medium text-emerald-300 mb-3 flex items-center gap-2">
                <CheckCircle size={16} /> Dicas Práticas
              </h4>
              <ul className="space-y-2">
                {advice.actionableTips.map((tip, idx) => (
                  <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
              <h4 className="font-medium text-rose-300 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} /> Pontos de Atenção
              </h4>
              <ul className="space-y-2">
                {advice.budgetAlerts.map((alert, idx) => (
                  <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-400 flex-shrink-0"></span>
                    {alert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;