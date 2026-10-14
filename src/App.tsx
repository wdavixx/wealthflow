/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Home as HomeIcon, 
  History, 
  PlusCircle, 
  BarChart3, 
  CheckSquare, 
  ShieldCheck, 
  User, 
  Sparkles,
  Bot
} from "lucide-react";

import { Transaction, Debt, Budget } from "./types";
import { initialTransactions, initialDebts, initialBudgets } from "./mockData";

// Tabs / Subcomponents
import Dashboard from "./components/Dashboard";
import HistoryList from "./components/HistoryList";
import AddTransaction from "./components/AddTransaction";
import BudgetsList from "./components/BudgetsList";
import DebtsRecovery from "./components/DebtsRecovery";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("Home");
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [debts, setDebts] = useState<Debt[]>(initialDebts);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Handle adding a new transaction dynamically
  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);

    // If it's an expense, update the matching budget category automatically
    if (newTx.type === "expense") {
      setBudgets((prevBudgets) => {
        return prevBudgets.map((b) => {
          if (b.category.toLowerCase() === newTx.category.toLowerCase()) {
            return {
              ...b,
              currentSpent: b.currentSpent + newTx.amount
            };
          }
          return b;
        });
      });
    }
  };

  // Handle updating a single debt (e.g. paying suggested agreement)
  const handlePayDebt = (targetDebt: Debt, paymentAmount: number) => {
    // 1. Mark debt status as paid
    setDebts((prevDebts) => 
      prevDebts.map((d) => (d.id === targetDebt.id ? { ...d, status: "paid" } : d))
    );

    // 2. Add an expense transaction for the settled debt payment
    const settlementTx: Transaction = {
      id: "settle_" + Date.now(),
      title: `Acordo ${targetDebt.creditor}`,
      category: "Serviços",
      type: "expense",
      amount: paymentAmount,
      date: "2026-06-30", // mock current date
      paymentMethod: "Debit Card",
      note: `Quitação total renegociada de dívida com ${targetDebt.creditor}`
    };

    handleAddTransaction(settlementTx);
  };

  // Handle updating single budget limit
  const handleUpdateBudgetLimit = (budgetId: string, newLimit: number) => {
    setBudgets((prev) => 
      prev.map((b) => b.id === budgetId ? { ...b, targetLimit: newLimit } : b)
    );
  };

  // Handle adding a custom budget
  const handleAddBudget = (newB: Budget) => {
    setBudgets((prev) => [...prev, newB]);
  };

  // Quick navigation helpers
  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    // Auto scroll container to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Container simulating a sleek premium mobile app centered on desktop, yet fluid on mobile */}
      <div className="w-full max-w-md min-h-screen bg-[#F8FAFC] shadow-xl flex flex-col pb-24 relative border-x border-gray-100/40">
        
        {/* Main Content View with transition */}
        <main className="flex-1 px-4 pt-2">
          {activeTab === "Home" && (
            <Dashboard 
              transactions={transactions} 
              onNavigate={handleNavigate}
              onOpenAddModal={() => handleNavigate("Add")}
            />
          )}

          {activeTab === "History" && (
            <HistoryList 
              transactions={transactions} 
            />
          )}

          {activeTab === "Add" && (
            <AddTransaction 
              onAddTransaction={handleAddTransaction}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === "Budgets" && (
            <BudgetsList 
              budgets={budgets}
              onAddBudget={handleAddBudget}
              onUpdateBudgetLimit={handleUpdateBudgetLimit}
            />
          )}

          {activeTab === "Debts" && (
            <DebtsRecovery 
              debts={debts}
              onUpdateDebt={(id, updates) => setDebts(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d))}
              onPayDebt={handlePayDebt}
            />
          )}
        </main>

        {/* Premium Bottom Nav Bar matching screen visuals exactly */}
        <nav className="fixed bottom-0 max-w-md w-full z-40 bg-white border-t border-gray-100/80 shadow-[0px_-8px_24px_rgba(0,0,0,0.04)] rounded-t-[28px] px-6 py-3 flex justify-between items-center pb-safe">
          
          {/* Home */}
          <button 
            onClick={() => handleNavigate("Home")}
            className={`flex flex-col items-center gap-1 transition-all duration-200 cursor-pointer ${
              activeTab === "Home" 
                ? "text-brand-primary font-bold scale-105" 
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === "Home" ? "bg-emerald-50 text-brand-primary" : ""}`}>
              <HomeIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Home</span>
          </button>

          {/* History */}
          <button 
            onClick={() => handleNavigate("History")}
            className={`flex flex-col items-center gap-1 transition-all duration-200 cursor-pointer ${
              activeTab === "History" 
                ? "text-brand-primary font-bold scale-105" 
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === "History" ? "bg-emerald-50 text-brand-primary" : ""}`}>
              <History className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">History</span>
          </button>

          {/* Add */}
          <button 
            onClick={() => handleNavigate("Add")}
            className={`flex flex-col items-center gap-1 transition-all duration-200 cursor-pointer ${
              activeTab === "Add" 
                ? "text-brand-primary font-bold scale-110" 
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <div className="p-1 rounded-full bg-emerald-100 hover:bg-emerald-200 text-brand-primary shadow-xs transition-colors">
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">Add</span>
          </button>

          {/* Budgets */}
          <button 
            onClick={() => handleNavigate("Budgets")}
            className={`flex flex-col items-center gap-1 transition-all duration-200 cursor-pointer ${
              activeTab === "Budgets" 
                ? "text-brand-primary font-bold scale-105" 
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === "Budgets" ? "bg-emerald-50 text-brand-primary" : ""}`}>
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Budgets</span>
          </button>

          {/* Debts (Acordos / Recuperação) */}
          <button 
            onClick={() => handleNavigate("Debts")}
            className={`flex flex-col items-center gap-1 transition-all duration-200 cursor-pointer ${
              activeTab === "Debts" 
                ? "text-brand-primary font-bold scale-105" 
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === "Debts" ? "bg-emerald-50 text-brand-primary" : ""}`}>
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Acordos</span>
          </button>

          {/* User profile option trigger */}
          <button 
            onClick={() => setShowProfileModal(true)}
            className="flex flex-col items-center gap-1 transition-all duration-200 cursor-pointer text-gray-400 hover:text-gray-600"
          >
            <div className="p-1.5">
              <User className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Perfil</span>
          </button>
        </nav>
      </div>

      {/* User profile modal option */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 text-center space-y-4 shadow-lg max-w-sm w-full animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-100 overflow-hidden mx-auto border-2 border-brand-mint">
              <img 
                className="w-full h-full object-cover" 
                alt="Alex profile" 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-gray-800">Alex de Souza</h4>
              <p className="text-xs text-gray-400 font-semibold">Plano Emerald Trust Ativo</p>
            </div>
            
            <div className="bg-emerald-50 p-3 rounded-2xl border border-brand-mint/20 text-xs font-semibold text-brand-primary flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Conexão Segura Ativa</span>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Sua conta WealthFlow está sincronizada de maneira segura e criptografada com as melhores diretrizes de conformidade financeira.
            </p>

            <button 
              onClick={() => setShowProfileModal(false)}
              className="w-full bg-brand-primary hover:bg-emerald-950 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Voltar ao Painel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
