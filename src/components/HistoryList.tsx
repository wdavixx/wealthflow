/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Search, 
  Calendar, 
  Tag, 
  Filter, 
  Coffee, 
  ShoppingBag, 
  Home as HomeIcon, 
  ArrowDownLeft, 
  HelpCircle,
  X
} from "lucide-react";
import { Transaction } from "../types";

interface HistoryListProps {
  transactions: Transaction[];
}

export default function HistoryList({ transactions }: HistoryListProps) {
  const [search, setSearch] = useState<string>("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [activeTypeFilter, setActiveTypeFilter] = useState<"expense" | "income" | null>(null);
  const [showMoreToast, setShowMoreToast] = useState<boolean>(false);

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = activeCategoryFilter ? t.category === activeCategoryFilter : true;
    const matchesType = activeTypeFilter ? t.type === activeTypeFilter : true;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Categories present in transactions for dynamic filter list
  const categories = Array.from(new Set(transactions.map((t) => t.category)));

  // Helper function to format dates nicely into "Hoje", "Ontem" or formatted dates
  const getGroupTitle = (dateStr: string) => {
    const todayStr = "2026-06-30"; // Mock relative to metadata
    const yesterdayStr = "2026-06-29";

    if (dateStr === todayStr) {
      return { title: "Hoje", subtitle: "30 de Junho" };
    } else if (dateStr === yesterdayStr) {
      return { title: "Ontem", subtitle: "29 de Junho" };
    } else {
      // Return formatted date
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        return { title: `${parts[2]}/${parts[1]}/${parts[0]}`, subtitle: "Data registrada" };
      }
      return { title: dateStr, subtitle: "Data registrada" };
    }
  };

  // Group transactions by date
  const groupedTransactions: { [key: string]: Transaction[] } = {};
  filteredTransactions.forEach((t) => {
    if (!groupedTransactions[t.date]) {
      groupedTransactions[t.date] = [];
    }
    groupedTransactions[t.date].push(t);
  });

  // Sorted dates (recent first)
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a));

  const handleLoadMore = () => {
    setShowMoreToast(true);
    setTimeout(() => setShowMoreToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Search and Filters Header */}
      <header className="space-y-4">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight px-1">Extrato de Transações</h1>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input 
            type="text" 
            placeholder="Pesquisar transações..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all shadow-xs font-medium text-slate-800 placeholder-slate-400"
          />
          {search && (
            <button 
              onClick={() => setSearch("")}
              className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {/* Type filters */}
          <button 
            onClick={() => setActiveTypeFilter(activeTypeFilter === "expense" ? null : "expense")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap border ${
              activeTypeFilter === "expense" 
                ? "bg-red-500 text-white border-red-500 shadow-xs" 
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Despesas</span>
          </button>

          <button 
            onClick={() => setActiveTypeFilter(activeTypeFilter === "income" ? null : "income")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap border ${
              activeTypeFilter === "income" 
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs" 
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Receitas</span>
          </button>

          {/* Category filter pills */}
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategoryFilter(activeCategoryFilter === cat ? null : cat)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap border ${
                activeCategoryFilter === cat 
                  ? "bg-sky-600 text-white border-sky-600 shadow-xs" 
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Grouped Lists */}
      <section className="space-y-6">
        {sortedDates.length > 0 ? (
          sortedDates.map((dateKey) => {
            const dateInfo = getGroupTitle(dateKey);
            const list = groupedTransactions[dateKey];

            return (
              <div key={dateKey} className="space-y-3">
                {/* Date Group Header */}
                <div className="flex justify-between items-end border-b border-slate-100 pb-2 px-1">
                  <h2 className="text-base font-extrabold text-slate-800 tracking-tight">{dateInfo.title}</h2>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {dateInfo.subtitle}
                  </span>
                </div>

                {/* Date group items */}
                <div className="space-y-2.5">
                  {list.map((item) => {
                    const isExpense = item.type === "expense";
                    return (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-xs border border-slate-200 hover:shadow-sm hover:border-sky-100 transition-all duration-200"
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
                            <p className="text-xs text-slate-400 font-semibold">{item.category}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={`text-sm font-bold ${isExpense ? "text-red-500" : "text-emerald-600"}`}>
                            {isExpense ? "-" : "+"}R$ {item.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-[10px] text-slate-400 font-semibold">{item.paymentMethod}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-400 space-y-2">
            <Search className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
            <p className="text-sm font-bold">Nenhuma transação encontrada</p>
            <p className="text-xs font-medium">Tente alterar ou limpar os filtros selecionados.</p>
          </div>
        )}
      </section>

      {/* Pagination Footer */}
      {sortedDates.length > 0 && (
        <div className="text-center pt-4 relative">
          <button 
            onClick={handleLoadMore}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
          >
            Carregar mais transações antigas
          </button>
          
          {showMoreToast && (
            <div className="absolute left-1/2 -translate-x-1/2 -top-12 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-lg animate-bounce z-50 whitespace-nowrap">
              Todas as transações recentes já estão visíveis no extrato.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
