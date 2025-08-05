"use client";

import { useContext, useState } from "react";
import { TransactionContext } from "../context/TransactionContext";
import TransactionForm from "../components/TransactionForm";
import DashboardSummary from "../components/DashboardSummary";
import TransactionChart from "../components/TransactionChart";
import { PlusCircle, TrendingUp, CheckCircle } from "lucide-react";

const Dashboard = () => {
  const { transactions } = useContext(TransactionContext);
  const [successMessage, setSuccessMessage] = useState("");

  // Calculate totals
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expenses;

  const handleAddTransaction = () => {
    setSuccessMessage("Transaction saved!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Financial Dashboard
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Welcome back! Here's your financial overview for today.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="xl:col-span-3 space-y-8">
            {/* Summary Cards */}
            <div className="animate-fade-in">
              <DashboardSummary income={income} expenses={expenses} balance={balance} />
            </div>

            {/* Transaction Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 animate-slide-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6">
                <TransactionChart transactions={transactions} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <PlusCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Quick Add</h2>
                      <p className="text-blue-100 text-sm">Add new transaction</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Success Message */}
                  {successMessage && (
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 animate-bounce-in">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <span className="font-medium">{successMessage}</span>
                    </div>
                  )}

                  {/* Transaction Form */}
                  <div className="space-y-4">
                    <TransactionForm onAddTransaction={handleAddTransaction} />
                  </div>
                </div>

                {/* Footer Stats */}
                <div className="bg-gray-50 p-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{transactions.length}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Total Transactions</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        {transactions.filter(t => t.type === 'income').length}
                      </p>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Income Entries</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
