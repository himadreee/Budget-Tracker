"use client"

import type React from "react"

import { useState, useContext } from "react"
import { TransactionContext } from "../context/TransactionContext"
import type { Transaction, TransactionType } from "../types"

const TransactionForm = () => {
  const { addTransaction } = useContext(TransactionContext)
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense" as TransactionType,
    category: "food",
    date: new Date().toISOString().split("T")[0],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description: formData.description,
      amount: Number.parseFloat(formData.amount),
      type: formData.type as TransactionType,
      category: formData.category,
      date: new Date(formData.date),
    }

    addTransaction(newTransaction)

    // Reset form
    setFormData({
      description: "",
      amount: "",
      type: "expense",
      category: "food",
      date: new Date().toISOString().split("T")[0],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
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

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
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

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
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

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
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

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Add Transaction
      </button>
    </form>
  )
}

export default TransactionForm
