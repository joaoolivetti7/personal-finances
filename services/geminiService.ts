import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, FinancialAdvice, TransactionType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFinances = async (transactions: Transaction[]): Promise<FinancialAdvice> => {
  // Filter and simplify data to reduce token usage and focus on patterns
  const simplifiedData = transactions.map(t => ({
    date: t.date,
    type: t.type,
    category: t.category,
    amount: t.amount,
    method: t.paymentMethod,
    desc: t.description
  }));

  const prompt = `
    Analise os seguintes dados financeiros pessoais (transações) e forneça um relatório de saúde financeira.
    O contexto é de um usuário brasileiro, então considere a moeda BRL (R$).
    Preste atenção especial ao uso do Cartão de Crédito (método: CREDIT_CARD) vs Dinheiro/Débito.
    
    Dados:
    ${JSON.stringify(simplifiedData)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            healthScore: {
              type: Type.NUMBER,
              description: "Uma pontuação de 0 a 100 indicando a saúde financeira.",
            },
            summary: {
              type: Type.STRING,
              description: "Um resumo executivo conciso da situação financeira atual, mencionando uso de crédito se relevante (max 2 parágrafos).",
            },
            actionableTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de 3 a 5 dicas práticas e específicas para melhorar as finanças com base nos gastos.",
            },
            budgetAlerts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Alertas sobre categorias ou uso excessivo de crédito.",
            }
          },
          required: ["healthScore", "summary", "actionableTips", "budgetAlerts"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as FinancialAdvice;
    }
    throw new Error("Não foi possível gerar a análise.");
  } catch (error) {
    console.error("Erro ao analisar finanças:", error);
    throw error;
  }
};