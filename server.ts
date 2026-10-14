/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

// Initialize Gemini client on the server
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("GEMINI_API_KEY not found in environment variables. Gemini features will be disabled or fallback.");
  }
} catch (err) {
  console.error("Failed to initialize Gemini Client", err);
}

// REST endpoints
app.post("/api/ai-recovery", async (req, res) => {
  const { debts, strategy } = req.body;

  if (!debts || !Array.isArray(debts)) {
    return res.status(400).json({ error: "Invalid debts array." });
  }

  const chosenStrategy = strategy || "avalanche";

  // System instruction for Gemini
  const systemInstruction = `Você é um Assistente Financeiro IA especialista em recuperação de crédito e renegociação de dívidas. 
Analise a lista de dívidas do usuário e o método selecionado (Avalanche: focar nas taxas de juros mais altas primeiro, ou Snowball: focar nos menores saldos primeiro).
Gere um relatório de estratégia em PORTUGUÊS brasileiro. Seja encorajador, prático, livre de termos complicados, estruturado e com foco na saúde financeira do usuário.`;

  const userPrompt = `
Método Selecionado: ${chosenStrategy === "avalanche" ? "Foco em Score / Taxa de Juros (Avalanche)" : "Limpar Nome Rápido / Menor Saldo (Snowball)"}

Dívidas atuais:
${debts.map((d, idx) => `- ${d.creditor}: Tipo: ${d.type}, Saldo: R$ ${d.currentAmount}, Sugestão de Acordo: R$ ${d.suggestedAmount}, Dias em atraso: ${d.daysOverdue} dias, Taxa de Juros: ${d.interestRate}% a.m.`).join("\n")}

Por favor, forneça:
1. Um resumo curto e motivador do plano de recuperação com projeção.
2. A ordem exata recomendada de quitação das dívidas (lista de nomes de credores).
3. 3 dicas práticas e altamente acionáveis para economizar, cortar gastos ou lidar com a negociação.
`;

  try {
    if (!ai) {
      // Return a simulated high-quality mock if Gemini key is missing so the app remains fully functional in development
      const fallbackOrder = [...debts]
        .sort((a, b) => chosenStrategy === "avalanche" ? b.interestRate - a.interestRate : a.currentAmount - b.currentAmount)
        .map(d => d.creditor);

      return res.json({
        summary: `Estratégia simulada (${chosenStrategy === "avalanche" ? "Avalanche" : "Snowball"}): Ao priorizar suas dívidas seguindo este plano, você otimiza seus pagamentos de forma consistente. Recomendamos focar imediatamente no primeiro credor listado para limpar seu nome o mais rápido possível e elevar seu score de crédito.`,
        order: fallbackOrder,
        tips: [
          "Crie uma reserva de emergência, mesmo que pequena (R$ 50 - R$ 100 por mês) antes de quitar tudo.",
          "Entre em contato direto com o credor número 1 da lista para propor o acordo com desconto.",
          "Substitua assinaturas ou pequenos gastos diários por alternativas gratuitas este mês."
        ]
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "Um resumo motivador e curto explicando o foco da estratégia, incluindo uma projeção de saúde financeira realista baseada no método selecionado.",
            },
            order: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A lista de credores na ordem recomendada de quitação (apenas os nomes dos credores da lista original).",
            },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Três dicas práticas, curtas e acionáveis em português sobre renegociação ou economia.",
            }
          },
          required: ["summary", "order", "tips"]
        }
      }
    });

    const text = response.text || "";
    const result = JSON.parse(text.trim());
    res.json(result);
  } catch (error: any) {
    console.error("Error generating content from Gemini:", error);
    res.status(500).json({ error: "Ocorreu um erro ao processar a estratégia com a Inteligência Artificial. Tente novamente." });
  }
});

// Setup Vite Dev Server / Serve Production Static Files
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
});
