"use client";

import { useState, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import type { TransactionType } from "../types";

interface TransactionFormProps {
  onAddTransaction: () => void; // 🛠️ new prop to tell parent when saved
}

const TransactionForm = ({ onAddTransaction }: TransactionFormProps) => {
  const { addTransaction } = useContext(TransactionContext);

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense" as TransactionType,
    category: "food",
    transaction_date: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newTransaction = {
      description: formData.description,
      amount: Number.parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      transaction_date: new Date(formData.transaction_date),
    };

    await addTransaction(newTransaction);

    // reset form
    setFormData({
      description: "",
      amount: "",
      type: "expense",
      category: "food",
      transaction_date: new Date().toISOString().split("T")[0],
    });

    setLoading(false);

    onAddTransaction(); // 🛠️ call parent to show success
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="Transaction description"
        />
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium mb-1">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          min="0.01"
          step="0.01"
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="0.00"
        />
      </div>

      {/* Type */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium mb-1">
          Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          {formData.type === "expense" ? (
            <>
              <option value="food">Food</option>
              <option value="transportation">Transportation</option>
              <option value="entertainment">Entertainment</option>
              <option value="utilities">Utilities</option>
              <option value="other">Other</option>
            </>
          ) : (
            <>
              <option value="salary">Salary</option>
              <option value="gift">Gift</option>
              <option value="investment">Investment</option>
              <option value="other">Other</option>
            </>
          )}
        </select>
      </div>

      {/* Date */}
      <div>
        <label htmlFor="transaction_date" className="block text-sm font-medium mb-1">
          Date
        </label>
        <input
          type="date"
          id="transaction_date"
          name="transaction_date"
          value={formData.transaction_date}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md transition-colors ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {loading ? "Saving..." : "Add Transaction"}
      </button>
    </form>
  );
};

export default TransactionForm;
