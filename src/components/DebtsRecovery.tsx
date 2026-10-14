/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ArrowLeft, 
  MoreVertical, 
  AlertTriangle, 
  TrendingDown, 
  History, 
  CreditCard, 
  Wifi, 
  ShoppingBag, 
  Sparkles, 
  ShieldAlert, 
  Handshake, 
  CheckCircle,
  HelpCircle,
  Clock,
  ExternalLink,
  Bot
} from "lucide-react";
import { Debt } from "../types";

interface DebtsRecoveryProps {
  debts: Debt[];
  onUpdateDebt: (debtId: string, updates: Partial<Debt>) => void;
  onPayDebt: (debt: Debt, customAmount: number) => void;
}

export default function DebtsRecovery({ debts, onUpdateDebt, onPayDebt }: DebtsRecoveryProps) {
  const [strategy, setStrategy] = useState<"avalanche" | "snowball">("avalanche");
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<{
    summary: string;
    order: string[];
    tips: string[];
  } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [activeNegotiatingDebt, setActiveNegotiatingDebt] = useState<Debt | null>(null);

  // Calculate sum of negativated debts
  const totalNegativeDebts = debts
    .filter(d => d.status === "negative")
    .reduce((sum, d) => sum + d.currentAmount, 0);

  // Sort debts based on selected strategy for displaying priority order
  const priorityDebts = [...debts].sort((a, b) => {
    if (strategy === "avalanche") {
      // Avalanche: highest interest rate first
      return b.interestRate - a.interestRate;
    } else {
      // Snowball: smallest current amount first
      return a.currentAmount - b.currentAmount;
    }
  });

  // Calculate customized savings with suggested proposals
  const originalTotal = debts.reduce((sum, d) => sum + d.currentAmount, 0);
  const renegTotal = debts.reduce((sum, d) => sum + d.suggestedAmount, 0);
  const totalReduction = originalTotal - renegTotal;

  // Run AI strategic engine
  const fetchAIRecoveryStrategy = async () => {
    setLoadingAI(true);
    setAiError(null);
    setAiReport(null);
    try {
      const response = await fetch("/api/ai-recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ debts, strategy }),
      });
      if (!response.ok) {
        throw new Error("Erro na comunicação com a IA");
      }
      const data = await response.json();
      setAiReport(data);
    } catch (err: any) {
      console.error(err);
      setAiError("Não foi possível conectar com o Motor IA WealthFlow no momento. Apresentando análise padrão.");
      // Standard local fallback for robust offline mode
      const fallbackOrder = [...debts]
        .sort((a, b) => strategy === "avalanche" ? b.interestRate - a.interestRate : a.currentAmount - b.currentAmount)
        .map(d => d.creditor);
      
      setAiReport({
        summary: `Priorize suas pendências pelo plano de ${strategy === "avalanche" ? "Score (Avalanche)" : "Quitação Rápida (Bola de Neve)"}. Isso possibilita economizar o máximo em taxas acumuladas e limpar seu histórico no Banco Central de maneira eficaz.`,
        order: fallbackOrder,
        tips: [
          "Foque em economizar pequenos valores mensais para acumular o valor para negociação à vista.",
          "Entre em contato direto com os canais oficiais do credor prioritário para renegociar com as propostas mostradas abaixo.",
          "Priorize o pagamento do Banco Santander pois ele representa a maior taxa de juros ativa."
        ]
      });
    } finally {
      setLoadingAI(false);
    }
  };

  const handlePayDirectly = (debt: Debt) => {
    onPayDebt(debt, debt.suggestedAmount);
    // Auto remove active reneg layout
    setActiveNegotiatingDebt(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <header className="flex justify-between items-center py-2 px-1">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Recuperação Financeira</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-slate-50 transition-colors border border-slate-100 cursor-pointer">
          <MoreVertical className="w-5 h-5 text-slate-500" />
        </button>
      </header>

      {/* Main Debts Status Card */}
      <section className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 flex-1 w-full text-left">
            <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Total em dívidas negativadas</p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              R$ {totalNegativeDebts.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </h2>
            
            {totalNegativeDebts > 0 ? (
              <div className="flex items-start gap-2 bg-red-50 border border-red-100/60 p-3 rounded-2xl">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-red-800 leading-relaxed">
                  Essas pendências estão reduzindo seu score de crédito atual.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100/60 p-3 rounded-2xl">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-emerald-800 leading-relaxed">
                  Parabéns! Você não tem nenhuma dívida negativada pendente.
                </p>
              </div>
            )}
          </div>

          {/* Circle Score Gauge */}
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle 
                className="text-slate-100" 
                cx="50" 
                cy="50" 
                fill="transparent" 
                r="40" 
                stroke="currentColor" 
                strokeWidth="8" 
              />
              <circle 
                className={`${totalNegativeDebts > 0 ? "text-amber-500" : "text-emerald-500"} transition-all duration-1000`} 
                cx="50" 
                cy="50" 
                fill="transparent" 
                r="40" 
                stroke="currentColor" 
                strokeWidth="8" 
                strokeDasharray="251.2" 
                strokeDashoffset={totalNegativeDebts > 0 ? "150" : "50"} 
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold text-slate-800">{totalNegativeDebts > 0 ? "342" : "820"}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score</span>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Strategy Selector */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 px-1">Selecione seu plano de recuperação</h3>
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center">
          <button 
            onClick={() => { setStrategy("avalanche"); setAiReport(null); }}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              strategy === "avalanche" 
                ? "bg-slate-900 text-white shadow-xs" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Foco em Score (Avalanche)
          </button>
          <button 
            onClick={() => { setStrategy("snowball"); setAiReport(null); }}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              strategy === "snowball" 
                ? "bg-slate-900 text-white shadow-xs" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Limpar Nome Rápido
          </button>
        </div>
        <p className="text-xs text-slate-500 px-1 leading-relaxed italic">
          {strategy === "avalanche" 
            ? "Priorizando a quitação de dívidas com maiores taxas de juros para economizar o máximo em juros compostos de atraso." 
            : "Priorizando as dívidas de menor valor absoluto para obter alívio psicológico e conquistas financeiras rápidas."
          }
        </p>
      </section>

      {/* AI STRATEGIC ENGINE BUTTON */}
      <section>
        <div className="bg-sky-50/40 border border-sky-100 rounded-3xl p-5 shadow-xs relative overflow-hidden group">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 bg-sky-50 text-sky-700 border border-sky-100/60 text-[10px] uppercase font-extrabold px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Motor Inteligente IA</span>
            </div>
            <Bot className="w-6 h-6 text-sky-600/40" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">Estratégia de Pagamento Avançada</h4>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed mb-4">
            Geramos um relatório personalizado recomendando a melhor ordem e passos de renegociação baseados na sua situação real.
          </p>
          
          <button 
            onClick={fetchAIRecoveryStrategy}
            disabled={loadingAI}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer disabled:opacity-75"
          >
            {loadingAI ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analisando suas dívidas com IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Ver análise estratégica ✨</span>
              </>
            )}
          </button>
        </div>

        {/* AI report display */}
        {aiReport && (
          <div className="mt-4 bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800 animate-slide-up space-y-4">
            <div className="flex items-center gap-2 text-sky-400 border-b border-slate-800 pb-3">
              <Bot className="w-5 h-5 shrink-0" />
              <h4 className="text-sm font-extrabold uppercase tracking-wider">Relatório do Analista IA WealthFlow</h4>
            </div>
            
            <p className="text-xs leading-relaxed text-slate-200 font-medium">
              {aiReport.summary}
            </p>

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-sky-400">Ordem de Prioridade Recomendada:</h5>
              <ol className="text-xs text-slate-200 space-y-1 bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
                {aiReport.order.map((creditorName, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[10px]">
                      {index + 1}
                    </span>
                    <span className="font-semibold">{creditorName}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-sky-400">Dicas Práticas para Ação:</h5>
              <ul className="text-xs text-slate-200 space-y-2">
                {aiReport.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-sky-400 font-bold mt-0.5">•</span>
                    <p className="leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {aiError && (
          <div className="mt-3 bg-red-50 text-red-800 text-xs p-3 rounded-xl border border-red-100 font-medium">
            {aiError}
          </div>
        )}
      </section>

      {/* Ordem de Recuperação Projections */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 px-1">Dívidas Organizadas por Prioridade</h3>
        
        <div className="space-y-3">
          {priorityDebts.map((item) => {
            const isNegative = item.status === "negative";
            const isNegotiated = item.status === "negotiated";
            const isPaid = item.status === "paid";
            
            return (
              <div 
                key={item.id}
                className={`bg-white rounded-2xl p-4 shadow-xs border transition-all ${
                  isPaid ? "border-emerald-100 bg-emerald-50/5" : "border-slate-200 hover:border-sky-200 hover:shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center border ${
                      item.type === "Cartão de Crédito" ? "bg-red-50 text-red-500 border-red-100" :
                      item.type === "Internet" ? "bg-sky-50 text-sky-600 border-sky-100" :
                      "bg-amber-50 text-amber-500 border-amber-100"
                    }`}>
                      {item.type === "Cartão de Crédito" ? <CreditCard className="w-5 h-5" /> :
                       item.type === "Internet" ? <Wifi className="w-5 h-5" /> :
                       <ShoppingBag className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{item.creditor}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                          isPaid ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                          isNegotiated ? "bg-sky-50 text-sky-700 border-sky-100" :
                          "bg-red-50 text-red-700 border-red-100"
                        }`}>
                          {isPaid ? "Quitada" : isNegotiated ? "Negociada" : "Negativada"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{item.daysOverdue} dias</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">
                      {item.interestRate}% a.m.
                    </span>
                    <p className="text-xs text-slate-400 mt-1 font-semibold">Juros de atraso</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Valor Original</span>
                    <span className="text-slate-700 font-bold">R$ {item.currentAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sky-600 font-semibold block text-[10px] uppercase tracking-wider">Proposta de Acordo</span>
                    <span className="text-sky-600 font-extrabold text-sm">
                      R$ {item.suggestedAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {isNegative && (
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => setActiveNegotiatingDebt(item)}
                      className="flex-1 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold py-2 rounded-xl border border-sky-100/60 transition-all cursor-pointer text-center"
                    >
                      Ver detalhes do acordo
                    </button>
                    <button 
                      onClick={() => onPayDebt(item, item.suggestedAmount)}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Pagar Agora
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Propostas de acordos customizados banner */}
      {totalNegativeDebts > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 px-1">Propostas de Liquidação</h3>
          
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-5 shadow-xs relative overflow-hidden border border-slate-800">
            <div className="relative z-10 space-y-3">
              <div className="flex justify-between items-center">
                <span className="bg-sky-500/10 text-sky-300 border border-sky-400/20 text-[10px] font-bold px-2.5 py-1 rounded-full">
                  65% de Economia Total
                </span>
                <Handshake className="w-5 h-5 text-sky-300" />
              </div>
              <div>
                <p className="text-xs text-sky-200 font-semibold">Aproveite as ofertas ativas</p>
                <h4 className="text-lg font-extrabold text-white mt-1">Economize R$ {totalReduction.toLocaleString("pt-BR")}</h4>
                <p className="text-[11px] text-sky-100/80 leading-relaxed mt-1">
                  Renegociando em lote, limpe seu nome e normalize seu histórico nos birôs de crédito em até 5 dias úteis.
                </p>
              </div>
            </div>
            {/* abstract decoration */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-slate-800 opacity-20 rounded-full blur-xl" />
          </div>
        </section>
      )}

      {/* Educational Article Card */}
      <section className="bg-white rounded-3xl p-5 border border-slate-200 flex flex-col md:flex-row gap-5 items-center">
        <div className="w-full md:w-1/3 aspect-video md:aspect-square bg-slate-100 rounded-2xl overflow-hidden relative shadow-xs">
          <img 
            className="w-full h-full object-cover" 
            alt="Workspace" 
            src="https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=256&auto=format&fit=crop"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-sky-600/10" />
        </div>
        <div className="flex-1 text-left space-y-3">
          <h3 className="text-sm font-extrabold text-slate-800">Como funciona o Score de Crédito?</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Pagar suas contas em dia e renegociar dívidas negativadas são as formas mais rápidas de elevar sua nota do Score. Ao quitar as ofertas acima, seu histórico de pagamentos será atualizado positivamente.
          </p>
          <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-600">
            <span className="bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              Dados Criptografados
            </span>
            <span className="bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-emerald-500" />
              Garantia de Negociação
            </span>
          </div>
        </div>
      </section>

      {/* Negotiation Details Modal */}
      {activeNegotiatingDebt && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-[32px] md:rounded-3xl p-6 space-y-5 animate-slide-up shadow-lg border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-800">Detalhes da Renegociação</h3>
              <button 
                onClick={() => setActiveNegotiatingDebt(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                Fechar
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-semibold uppercase">Credor</p>
              <h4 className="text-lg font-extrabold text-slate-900">{activeNegotiatingDebt.creditor}</h4>
              <p className="text-xs text-slate-500 font-medium">Contrato em atraso há {activeNegotiatingDebt.daysOverdue} dias.</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-semibold">Valor em aberto total</span>
                <span className="text-slate-800 font-bold">R$ {activeNegotiatingDebt.currentAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-xs border-t border-slate-100 pt-2">
                <span className="text-sky-600 font-bold">Acordo com desconto de liquidação</span>
                <span className="text-sky-600 font-extrabold">R$ {activeNegotiatingDebt.suggestedAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold pt-1">
                <span>Taxa de desconto calculada</span>
                <span className="bg-sky-50 text-sky-700 border border-sky-100 px-1.5 py-0.5 rounded font-bold">
                  {Math.round(((activeNegotiatingDebt.currentAmount - activeNegotiatingDebt.suggestedAmount) / activeNegotiatingDebt.currentAmount) * 100)}% OFF
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setActiveNegotiatingDebt(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-3 rounded-xl transition-all cursor-pointer"
              >
                Voltar
              </button>
              <button 
                onClick={() => handlePayDirectly(activeNegotiatingDebt)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                Confirmar Pagamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
