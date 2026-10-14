/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Coffee, 
  Home as HomeIcon, 
  Heart, 
  Plus, 
  Activity, 
  Delete, 
  Calendar, 
  Check, 
  FileText,
  HelpCircle,
  Smartphone,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { Transaction } from "../types";

interface AddTransactionProps {
  onAddTransaction: (t: Transaction) => void;
  onNavigate: (tab: string) => void;
}

export default function AddTransaction({ onAddTransaction, onNavigate }: AddTransactionProps) {
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amountStr, setAmountStr] = useState<string>("0,00");
  const [category, setCategory] = useState<string>("Alimentação");
  const [note, setNote] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("2026-06-30"); // default to mock current date
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { label: "Food", labelPt: "Alimentação", icon: <Coffee className="w-5 h-5" /> },
    { label: "Rent", labelPt: "Moradia", icon: <HomeIcon className="w-5 h-5" /> },
    { label: "Fun", labelPt: "Lazer", icon: <Sparkles className="w-5 h-5" /> },
    { label: "Health", labelPt: "Saúde", icon: <Activity className="w-5 h-5" /> },
    { label: "Transport", labelPt: "Transporte", icon: <Smartphone className="w-5 h-5" /> }
  ];

  // Handles custom numeric keypad interactions
  const handleKeyPress = (char: string) => {
    setError(null);
    if (char === "delete") {
      setAmountStr((prev) => {
        if (prev === "0,00" || prev.length <= 1) return "0,00";
        // Remove last character
        let cut = prev.slice(0, -1);
        if (cut.endsWith(",")) {
          cut = cut.slice(0, -1);
        }
        if (cut === "") return "0,00";
        return cut;
      });
      return;
    }

    setAmountStr((prev) => {
      if (prev === "0,00") {
        if (char === ",") return "0,";
        return char;
      }

      // Check for comma rules
      if (char === ",") {
        if (prev.includes(",")) return prev;
        return prev + ",";
      }

      // Limit decimals to 2 places
      if (prev.includes(",")) {
        const parts = prev.split(",");
        if (parts[1] && parts[1].length >= 2) {
          return prev;
        }
      }

      return prev + char;
    });
  };

  const handleSave = () => {
    // Parse Brazilian formatted currency to number
    const normalized = amountStr.replace(/\./g, "").replace(",", ".");
    const parsedAmount = parseFloat(normalized);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Por favor, digite um valor válido maior que R$ 0,00.");
      return;
    }

    const newTx: Transaction = {
      id: "t_" + Date.now(),
      title: note ? note : category,
      category: category,
      type: type,
      amount: parsedAmount,
      date: dateStr,
      paymentMethod: type === "expense" ? "Debit Card" : "Direct Deposit",
      note: note
    };

    onAddTransaction(newTx);
    setShowSuccess(true);
    
    // Auto redirect back after 1.2s
    setTimeout(() => {
      setShowSuccess(false);
      onNavigate("Home");
      // Reset form
      setAmountStr("0,00");
      setNote("");
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-28 animate-fade-in relative min-h-[85vh]">
      {/* Header Close */}
      <header className="flex justify-between items-center py-2 px-1">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Adicionar Transação</h1>
        <div className="w-10 h-10" /> {/* Spacer */}
      </header>

      {/* Expense/Income pills */}
      <div className="bg-slate-100 p-1 rounded-full flex items-center border border-slate-200/50">
        <button 
          onClick={() => setType("expense")}
          className={`flex-1 py-3 text-xs font-bold rounded-full transition-all cursor-pointer ${
            type === "expense" 
              ? "bg-slate-900 text-white shadow-xs" 
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Despesa
        </button>
        <button 
          onClick={() => setType("income")}
          className={`flex-1 py-3 text-xs font-bold rounded-full transition-all cursor-pointer ${
            type === "income" 
              ? "bg-slate-900 text-white shadow-xs" 
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Receita
        </button>
      </div>

      {/* Large Total Amount Field */}
      <div className="text-center py-6 space-y-1">
        <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Valor total</p>
        <div className="flex items-center justify-center">
          <span className="text-2xl font-extrabold text-sky-600 mr-1">R$</span>
          <span className="text-4xl font-black text-slate-800 tracking-tight">
            {amountStr}
          </span>
          <span className="w-1.5 h-10 bg-sky-500 ml-1.5 animate-pulse" />
        </div>
        {error && (
          <p className="text-red-500 text-xs font-semibold pt-1 animate-pulse">{error}</p>
        )}
      </div>

      {/* Category Horizontal Scroll */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider px-1">Categoria</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button 
              key={cat.label}
              type="button"
              onClick={() => setCategory(cat.labelPt)}
              className={`flex flex-col items-center gap-2 min-w-[72px] cursor-pointer group`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-xs ${
                category === cat.labelPt 
                  ? "bg-sky-600 text-white scale-105 shadow-sm shadow-sky-100" 
                  : "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50"
              }`}>
                {cat.icon}
              </div>
              <span className={`text-[11px] font-bold ${category === cat.labelPt ? "text-sky-600" : "text-slate-500"}`}>
                {cat.labelPt}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Inputs for Date & Optional notes */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block px-1">Data</label>
          <div className="relative">
            <input 
              type="date" 
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden shadow-xs text-slate-800"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block px-1">Nota (Opcional)</label>
          <input 
            type="text" 
            placeholder="Adicionar nota..." 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden shadow-xs text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Embedded Bento Image Card */}
      <div className="rounded-3xl overflow-hidden relative h-36 border border-slate-200 shadow-xs bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=256&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent flex items-end p-4">
          <p className="text-white text-xs font-semibold leading-relaxed">
            Mantenha seu fluxo de caixa em dia organizando seus orçamentos mensais com carinho.
          </p>
        </div>
      </div>

      {/* Floating keypad drawer style at bottom */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg rounded-t-[32px] overflow-hidden border-t border-slate-200 z-40">
        <div className="p-1.5">
          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-0.5 bg-slate-100 rounded-2xl overflow-hidden text-center text-sm font-bold text-slate-800">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0"].map((num) => (
              <button 
                key={num}
                type="button"
                onClick={() => handleKeyPress(num)}
                className="bg-white py-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer select-none text-base"
              >
                {num}
              </button>
            ))}
            <button 
              type="button"
              onClick={() => handleKeyPress("delete")}
              className="bg-white py-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors text-red-500 flex items-center justify-center cursor-pointer select-none"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action confirmation button */}
        <div className="px-4 py-4 bg-white border-t border-slate-100">
          <button 
            type="button"
            onClick={handleSave}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl font-bold text-sm tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            Salvar Transação
          </button>
        </div>
      </div>

      {/* Success Alert Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 text-center space-y-3 shadow-md max-w-xs animate-scale-up">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-slate-800">Transação Salva!</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Sua transação foi registrada com sucesso e seus limites de orçamento foram atualizados.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
