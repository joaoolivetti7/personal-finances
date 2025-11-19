import React, { useEffect, useState } from 'react';
import { Plus, Wallet, BarChart3, LayoutDashboard, Settings, Moon, Sun } from 'lucide-react';
import SummaryCards from './components/SummaryCards';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import CategoryChart from './components/CategoryChart';
import AIAdvisor from './components/AIAdvisor';
import DataSettings from './components/DataSettings';
import { Transaction } from './types';
import { getStoredTransactions, saveTransactions } from './services/storage';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report'>('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or system preference
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const data = getStoredTransactions();
    setTransactions(data);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleAddTransaction = (newTx: Transaction) => {
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveTransactions(updated);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    saveTransactions(updated);
  };

  const handleImportData = (importedData: Transaction[]) => {
    setTransactions(importedData);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans pb-20 transition-colors duration-300">
      {/* Navbar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-2 rounded-lg text-white shadow-lg shadow-brand-500/30">
              <Wallet size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Finanças<span className="text-brand-600 dark:text-brand-400">AI</span></span>
          </div>

          <nav className="hidden md:flex gap-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'report' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              <BarChart3 size={18} />
              Relatórios
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? "Modo Claro" : "Modo Escuro"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Gerenciar Dados"
            >
              <Settings size={20} />
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Nova Transação</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-2 z-40 flex justify-around transition-colors duration-300">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 'dashboard' ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 text-white p-3 rounded-full -mt-8 shadow-lg border-4 border-slate-50 dark:border-slate-950"
        >
          <Plus size={24} />
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 'report' ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <BarChart3 size={20} />
          <span className="text-[10px] font-medium mt-1">Relatórios</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SummaryCards transactions={transactions} />

        <AIAdvisor transactions={transactions} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (List) */}
          <div className="lg:col-span-2">
            <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
          </div>

          {/* Right Column (Chart) */}
          <div className="lg:col-span-1 h-96 lg:h-auto">
            <CategoryChart transactions={transactions} />
          </div>
        </div>
      </main>

      {/* Modals */}
      {isModalOpen && (
        <TransactionForm onAdd={handleAddTransaction} onClose={() => setIsModalOpen(false)} />
      )}

      {isSettingsOpen && (
        <DataSettings
          transactions={transactions}
          onClose={() => setIsSettingsOpen(false)}
          onImport={handleImportData}
        />
      )}
    </div>
  );
};

export default App;