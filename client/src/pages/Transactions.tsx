"use client";

import { useState, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import TransactionList from "../components/TransactionList";
import type { FilterOptions } from "../types";

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

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Transactions</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="border rounded-md p-2 text-sm"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="border rounded-md p-2 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="salary">Salary</option>
            <option value="food">Food</option>
            <option value="transportation">Transportation</option>
            <option value="entertainment">Entertainment</option>
            <option value="utilities">Utilities</option>
            <option value="other">Other</option>
          </select>

          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="border rounded-md p-2 text-sm"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="category">Category</option>
          </select>

          <select
            name="sortOrder"
            value={filters.sortOrder}
            onChange={handleFilterChange}
            className="border rounded-md p-2 text-sm"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <TransactionList filters={filters} />
    </div>
  );
};

export default Transactions;
