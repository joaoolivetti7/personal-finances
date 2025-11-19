import React, { useRef, useState } from 'react';
import { Transaction } from '../types';
import { Download, Upload, X, AlertTriangle, Check, FileJson } from 'lucide-react';
import { saveTransactions } from '../services/storage';

interface Props {
    transactions: Transaction[];
    onClose: () => void;
    onImport: (data: Transaction[]) => void;
}

const DataSettings: React.FC<Props> = ({ transactions, onClose, onImport }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleExport = () => {
        try {
            const dataStr = JSON.stringify(transactions, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `financas-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setMessage({ text: 'Backup baixado com sucesso!', type: 'success' });
        } catch (e) {
            setMessage({ text: 'Erro ao gerar backup.', type: 'error' });
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                const parsed = JSON.parse(content);

                // Basic validation
                if (!Array.isArray(parsed)) {
                    throw new Error("Formato inválido.");
                }

                // Simple check if it looks like transactions
                if (parsed.length > 0 && (!parsed[0].id || !parsed[0].amount)) {
                    throw new Error("Dados inválidos.");
                }

                onImport(parsed);
                saveTransactions(parsed); // Persist immediately
                setMessage({ text: 'Dados restaurados com sucesso!', type: 'success' });
                setTimeout(onClose, 1500);
            } catch (err) {
                setMessage({ text: 'Arquivo inválido ou corrompido.', type: 'error' });
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <FileJson size={20} className="text-brand-600" />
                        Gerenciar Dados
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <p className="text-sm text-slate-600">
                        Seus dados ficam salvos apenas neste navegador. Faça backups regulares para não perdê-los.
                    </p>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                            }`}>
                            {message.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
                            {message.text}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={handleExport}
                            className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-brand-500 hover:bg-brand-50 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-100 text-brand-600 rounded-lg group-hover:bg-brand-200">
                                    <Download size={20} />
                                </div>
                                <div className="text-left">
                                    <span className="block font-medium text-slate-800">Fazer Backup</span>
                                    <span className="block text-xs text-slate-500">Baixar arquivo .json</span>
                                </div>
                            </div>
                        </button>

                        <div className="relative">
                            <input
                                type="file"
                                accept=".json"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button
                                onClick={handleImportClick}
                                className="w-full flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-200">
                                        <Upload size={20} />
                                    </div>
                                    <div className="text-left">
                                        <span className="block font-medium text-slate-800">Restaurar Dados</span>
                                        <span className="block text-xs text-slate-500">Importar arquivo .json</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                        <p className="text-xs text-yellow-800 flex gap-2">
                            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                            <span>
                                Atenção: Restaurar um backup substituirá todas as transações atuais.
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataSettings;