/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Eye, 
  EyeOff, 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  BarChart3, 
  Grid, 
  Bell, 
  ArrowDownLeft, 
  ChevronRight,
  Coffee,
  ShoppingBag,
  Home as HomeIcon,
  HelpCircle,
  Plus
} from "lucide-react";
import { Transaction } from "../types";

interface DashboardProps {
  transactions: Transaction[];
  onNavigate: (tab: string) => void;
  onOpenAddModal: () => void;
}

export default function Dashboard({ transactions, onNavigate, onOpenAddModal }: DashboardProps) {
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [notifCount, setNotifCount] = useState<number>(2);

  const totalBalance = 12450.00;

  // Get top 3 recent transactions
  const recentTransactions = transactions.slice(0, 3);

  // Grouped weekly spendings mock percentage heights
  const weeklySpends = [
    { day: "S", height: "h-[40%]", amount: "R$ 110,00" },
    { day: "T", height: "h-[65%]", amount: "R$ 180,00" },
    { day: "Q", height: "h-[35%]", amount: "R$ 95,00" },
    { day: "Q", height: "h-[85%]", amount: "R$ 240,00", active: true },
    { day: "S", height: "h-[50%]", amount: "R$ 140,00" },
    { day: "S", height: "h-[30%]", amount: "R$ 80,00" },
    { day: "D", height: "h-[45%]", amount: "R$ 125,00" }
  ];

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      {/* Header Profile Section */}
      <header className="flex justify-between items-center py-4 px-1">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden shadow-sm">
            <img 
              className="w-full h-full object-cover" 
              alt="Alex Avatar" 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Bem-vindo,</p>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Olá, Alex</h1>
          </div>
        </div>
        <button 
          onClick={() => setNotifCount(0)}
          className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200/80 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5 text-slate-700" />
          {notifCount > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
      </header>

      {/* Main Balance Card */}
      <section>
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white rounded-3xl p-6 shadow-lg shadow-slate-100 relative overflow-hidden group border border-slate-800/20">
          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-[11px] uppercase text-slate-400 font-bold tracking-wider">Saldo Total</span>
              <button 
                onClick={() => setShowBalance(!showBalance)}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                title={showBalance ? "Ocultar Saldo" : "Mostrar Saldo"}
              >
                {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold text-sky-400">R$</span>
              <span className="text-4xl font-extrabold tracking-tight transition-all duration-300">
                {showBalance ? totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "••••••"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sky-300 text-xs font-semibold bg-sky-950/50 border border-sky-800/30 w-fit px-3 py-1.5 rounded-full">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>+ 2.4% este mês</span>
            </div>
          </div>
          
          {/* Subtle background abstract shapes */}
          <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-sky-600 opacity-20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute -left-12 -top-12 w-36 h-36 bg-sky-700 opacity-15 rounded-full blur-xl" />
        </div>
      </section>

      {/* Quick Actions Panel */}
      <section>
        <div className="grid grid-cols-4 gap-2.5 py-2">
          <button 
            onClick={() => onNavigate("Add")}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-100/80 border border-slate-200 text-slate-800 shadow-xs group-hover:shadow-sm group-hover:bg-slate-200/50 transition-all duration-200 group-active:scale-95 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-600">Pagar</span>
          </button>

          <button 
            onClick={() => onNavigate("Debts")}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 shadow-xs group-hover:shadow-sm group-hover:bg-sky-100/80 transition-all duration-200 group-active:scale-95 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-600">Acordos</span>
          </button>

          <button 
            onClick={() => onNavigate("Budgets")}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-xs group-hover:shadow-sm group-hover:bg-indigo-100/80 transition-all duration-200 group-active:scale-95 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-600">Metas</span>
          </button>

          <button 
            onClick={() => onNavigate("History")}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 shadow-xs group-hover:shadow-sm group-hover:bg-slate-100 transition-all duration-200 group-active:scale-95 flex items-center justify-center">
              <Grid className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-600">Extrato</span>
          </button>
        </div>
      </section>

      {/* Spending Chart Card */}
      <section className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Gastos semanais</h2>
          <span className="text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-full">
            Últimos 7 dias
          </span>
        </div>

        <div className="h-40 w-full flex items-end justify-between gap-3 px-1">
          {weeklySpends.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group/bar relative">
              {/* Tooltip amount */}
              <div className="absolute -top-7 opacity-0 group-hover/bar:opacity-100 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow-sm pointer-events-none transition-opacity duration-200 whitespace-nowrap z-20">
                {item.amount}
              </div>
              
              <div className={`w-full rounded-t-lg transition-all duration-300 cursor-pointer ${
                item.active 
                  ? "bg-sky-600 shadow-xs shadow-sky-100" 
                  : "bg-slate-100 hover:bg-slate-200"
                } ${item.height}`} 
              />
              <span className={`text-xs font-bold ${item.active ? "text-sky-600" : "text-slate-400"}`}>
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Transactions List */}
      <section className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Transações</h2>
          <button 
            onClick={() => onNavigate("History")}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer flex items-center gap-0.5"
          >
            Ver tudo <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentTransactions.map((item) => {
            const isExpense = item.type === "expense";
            return (
              <div 
                key={item.id} 
                className="flex items-center justify-between py-3 hover:bg-slate-50/50 rounded-xl px-2 transition-colors duration-150 cursor-pointer"
                onClick={() => onNavigate("History")}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                    item.category === "Alimentação" ? "bg-orange-50 text-orange-600 border border-orange-100/50" :
                    item.category === "Compras" ? "bg-sky-50 text-sky-600 border border-sky-100/50" :
                    item.category === "Moradia" ? "bg-indigo-50 text-indigo-600 border border-indigo-100/50" :
                    item.category === "Transporte" ? "bg-slate-50 text-slate-600 border border-slate-200/50" :
                    item.category === "Renda" ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50" :
                    "bg-slate-50 text-slate-600"
                  }`}>
                    {item.category === "Alimentação" ? <Coffee className="w-5 h-5" /> :
                     item.category === "Compras" ? <ShoppingBag className="w-5 h-5" /> :
                     item.category === "Moradia" ? <HomeIcon className="w-5 h-5" /> :
                     item.category === "Renda" ? <ArrowDownLeft className="w-5 h-5" /> :
                     <HelpCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                    <p className="text-xs text-slate-400 font-medium">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${isExpense ? "text-red-500" : "text-emerald-600"}`}>
                    {isExpense ? "-" : "+"}R$ {item.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">{item.paymentMethod}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Simple FAB action bottom corner trigger */}
      <button 
        onClick={onOpenAddModal}
        className="fixed bottom-24 right-5 bg-sky-600 hover:bg-sky-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-sky-200/50 hover:scale-105 active:scale-95 transition-all cursor-pointer z-40"
        title="Adicionar Transação"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
