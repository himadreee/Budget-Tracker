"use client";

import { useState, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import TransactionList from "../components/TransactionList";
import type { FilterOptions } from "../types";
import { 
  Receipt, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  ArrowUpDown,
  Tag,
  Search,
  RefreshCw
} from "lucide-react";

const Transactions = () => {
  const { transactions } = useContext(TransactionContext);
  const [filters, setFilters] = useState<FilterOptions>({
    type: "all",
    category: "all",
    sortBy: "date",
    sortOrder: "desc",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      type: "all",
      category: "all",
      sortBy: "date",
      sortOrder: "desc",
    });
  };

  // Calculate filtered stats
  const filteredTransactions = transactions.filter(transaction => {
    if (filters.type !== "all" && transaction.type !== filters.type) return false;
    if (filters.category !== "all" && transaction.category !== filters.category) return false;
    return true;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Receipt className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Transaction History
                </h1>
                <p className="text-gray-600 text-lg">
                  Track and manage all your financial transactions
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Total Income</p>
                    <p className="text-2xl font-bold">${totalIncome.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-emerald-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Total Expenses</p>
                    <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Transactions</p>
                    <p className="text-2xl font-bold">{filteredTransactions.length}</p>
                  </div>
                  <Receipt className="h-8 w-8 text-blue-200" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-8 animate-slide-up">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            {/* Filter Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Filter className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Smart Filters</h2>
                    <p className="text-indigo-100 text-sm">Filter and sort your transactions</p>
                  </div>
                </div>
                
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Transaction Type Filter */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <DollarSign className="h-4 w-4 text-indigo-500" />
                    Transaction Type
                  </label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                  >
                    <option value="all">🔍 All Types</option>
                    <option value="income">💰 Income</option>
                    <option value="expense">💸 Expense</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Tag className="h-4 w-4 text-purple-500" />
                    Category
                  </label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                  >
                    <option value="all">📂 All Categories</option>
                    <option value="salary">💼 Salary</option>
                    <option value="food">🍕 Food</option>
                    <option value="transportation">🚗 Transportation</option>
                    <option value="entertainment">🎮 Entertainment</option>
                    <option value="utilities">💡 Utilities</option>
                    <option value="other">📦 Other</option>
                  </select>
                </div>

                {/* Sort By Filter */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <ArrowUpDown className="h-4 w-4 text-emerald-500" />
                    Sort By
                  </label>
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                  >
                    <option value="date">📅 Date</option>
                    <option value="amount">💵 Amount</option>
                    <option value="category">🏷️ Category</option>
                  </select>
                </div>

                {/* Sort Order Filter */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar className="h-4 w-4 text-pink-500" />
                    Sort Order
                  </label>
                  <select
                    name="sortOrder"
                    value={filters.sortOrder}
                    onChange={handleFilterChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                  >
                    <option value="desc">⬇️ Newest First</option>
                    <option value="asc">⬆️ Oldest First</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(filters.type !== "all" || filters.category !== "all") && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Active Filters:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filters.type !== "all" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Type: {filters.type}
                      </span>
                    )}
                    {filters.category !== "all" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Category: {filters.category}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="animate-slide-up-delayed">
          <TransactionList filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
