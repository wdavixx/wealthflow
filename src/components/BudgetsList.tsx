/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Coffee, 
  Car, 
  Film, 
  HelpCircle, 
  Plus, 
  MoreVertical, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Home as HomeIcon
} from "lucide-react";
import { Budget } from "../types";

interface BudgetsListProps {
  budgets: Budget[];
  onAddBudget: (newBudget: Budget) => void;
  onUpdateBudgetLimit: (id: string, newLimit: number) => void;
}

export default function BudgetsList({ budgets, onAddBudget, onUpdateBudgetLimit }: BudgetsListProps) {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newCat, setNewCat] = useState<string>("Alimentação");
  const [newLimit, setNewLimit] = useState<number>(500);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [editLimitValue, setEditLimitValue] = useState<string>("");
  const [newCatError, setNewCatError] = useState<string | null>(null);

  // Calculate sum of spent vs total limits
  const totalSpent = budgets.reduce((sum, b) => sum + b.currentSpent, 0);
  const totalLimit = budgets.reduce((sum, b) => sum + b.targetLimit, 0);
  const spentPercent = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setNewCatError(null);
    if (!newLimit || newLimit <= 0) return;

    // Check if category already exists to avoid duplication
    const exists = budgets.find(b => b.category.toLowerCase() === newCat.toLowerCase());
    if (exists) {
      setNewCatError("Já existe um orçamento para essa categoria. Você pode editar o limite do orçamento existente.");
      return;
    }

    const created: Budget = {
      id: "b_" + Date.now(),
      category: newCat,
      namePt: newCat,
      nameEn: newCat === "Alimentação" ? "Food" : newCat === "Transporte" ? "Transport" : "Entertainment",
      currentSpent: 0,
      targetLimit: newLimit,
      iconName: newCat === "Alimentação" ? "restaurant" : newCat === "Transporte" ? "commute" : "movie"
    };

    onAddBudget(created);
    setShowAddModal(false);
  };

  const startEdit = (b: Budget) => {
    setEditingBudget(b);
    setEditLimitValue(b.targetLimit.toString());
  };

  const handleSaveEdit = () => {
    if (editingBudget && editLimitValue) {
      const parsed = parseFloat(editLimitValue);
      if (!isNaN(parsed) && parsed > 0) {
        onUpdateBudgetLimit(editingBudget.id, parsed);
        setEditingBudget(null);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight px-1">Orçamentos de Junho</h1>
        <p className="text-xs text-slate-500 font-medium px-1">Seu planejamento financeiro mensal atualizado em tempo real.</p>
      </header>

      {/* Main Gasto Total Summary Card */}
      <section className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">Gasto Total do Mês</p>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              R$ {totalSpent.toLocaleString("pt-BR")} <span className="text-sm font-semibold text-slate-400">/ R$ {totalLimit.toLocaleString("pt-BR")}</span>
            </h2>
          </div>
          <div className="text-right">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
              spentPercent > 85 ? "bg-red-100 text-red-800" : "bg-sky-50 text-sky-700 border border-sky-100/60"
            }`}>
              {spentPercent}% utilizado
            </span>
          </div>
        </div>

        {/* Progress bar track */}
        <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
          <div 
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${
              spentPercent > 85 ? "bg-red-500" : "bg-sky-600"
            }`}
            style={{ width: `${Math.min(spentPercent, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] font-bold text-slate-400">
          <span>Início do mês</span>
          <span>Meta: R$ {totalLimit.toLocaleString("pt-BR")}</span>
        </div>
      </section>

      {/* Budgets Category Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {budgets.map((b) => {
          const percent = b.targetLimit > 0 ? Math.round((b.currentSpent / b.targetLimit) * 100) : 0;
          const isWarning = percent >= 90;

          return (
            <div 
              key={b.id}
              className={`bg-white rounded-2xl p-5 shadow-xs border transition-all duration-300 ${
                isWarning ? "border-l-4 border-l-red-500 border-red-100" : "border-slate-200 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                    isWarning ? "bg-red-50 text-red-500" : "bg-sky-50 text-sky-600 border border-sky-100"
                  }`}>
                    {b.iconName === "restaurant" ? <Coffee className="w-5 h-5" /> :
                     b.iconName === "commute" ? <Car className="w-5 h-5" /> :
                     <Film className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">{b.namePt}</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{b.nameEn}</p>
                  </div>
                </div>

                <button 
                  onClick={() => startEdit(b)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-between mb-2 text-xs font-bold">
                <span className="text-slate-800">R$ {b.currentSpent.toLocaleString("pt-BR")}</span>
                <span className="text-slate-400">R$ {b.targetLimit.toLocaleString("pt-BR")}</span>
              </div>

              {/* Individual budget progress bar */}
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    isWarning ? "bg-red-500 animate-pulse" : "bg-sky-600"
                  }`} 
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] font-bold">
                {isWarning ? (
                  <span className="text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    Limite Próximo
                  </span>
                ) : (
                  <span className="text-slate-400">{percent}% do limite</span>
                )}
                <span className="text-slate-400">{percent}%</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA Action - Add Budget */}
      <div className="text-center pt-6">
        <button 
          onClick={() => {
            setNewCatError(null);
            setShowAddModal(true);
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 mx-auto shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Criar novo orçamento</span>
        </button>
      </div>

      {/* Create New Budget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center p-4 z-50 animate-fade-in">
          <form 
            onSubmit={handleCreate}
            className="bg-white w-full max-w-sm rounded-t-[32px] md:rounded-3xl p-6 space-y-5 animate-slide-up shadow-lg border border-slate-200"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-800">Criar Orçamento</h3>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-xs cursor-pointer"
              >
                Fechar
              </button>
            </div>

            {newCatError && (
              <p className="text-red-500 text-xs font-semibold leading-relaxed bg-red-50 p-2.5 rounded-xl border border-red-100">{newCatError}</p>
            )}

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-bold uppercase block">Categoria</label>
              <select 
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-sky-500 outline-hidden text-slate-800 font-medium"
              >
                <option value="Alimentação">Alimentação (Food)</option>
                <option value="Transporte">Transporte (Transport)</option>
                <option value="Lazer">Lazer / Entretenimento (Entertainment)</option>
                <option value="Serviços">Serviços (Services)</option>
                <option value="Moradia">Moradia (Rent)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-bold uppercase block">Meta de Limite (R$)</label>
              <input 
                type="number" 
                value={newLimit}
                onChange={(e) => setNewLimit(parseFloat(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-sky-500 outline-hidden text-slate-800"
                placeholder="Ex: 500"
                min="1"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3.5 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              Salvar Orçamento
            </button>
          </form>
        </div>
      )}

      {/* Edit Budget Modal */}
      {editingBudget && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-t-[32px] md:rounded-3xl p-6 space-y-5 animate-slide-up shadow-lg border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-800">Editar Limite de Orçamento</h3>
              <button 
                onClick={() => setEditingBudget(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-xs cursor-pointer"
              >
                Fechar
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-bold uppercase">Categoria</p>
              <p className="text-sm font-bold text-sky-600">{editingBudget.category}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-bold uppercase block">Novo Limite (R$)</label>
              <input 
                type="number" 
                value={editLimitValue}
                onChange={(e) => setEditLimitValue(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-sky-500 outline-hidden text-slate-800"
                placeholder="Ex: 800"
                required
              />
            </div>

            <button 
              onClick={handleSaveEdit}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3.5 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              Salvar Limite
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
