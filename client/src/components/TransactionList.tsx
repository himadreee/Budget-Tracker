"use client"

import { useContext } from "react"
import { TransactionContext } from "../context/TransactionContext"
import TransactionItem from "./TransactionItem"
import type { FilterOptions } from "../types"

interface TransactionListProps {
  filters: FilterOptions
}

const TransactionList = ({ filters }: TransactionListProps) => {
  const { transactions, deleteTransaction } = useContext(TransactionContext)

  // Apply filters
  const filteredTransactions = transactions.filter((transaction) => {
    if (filters.type !== "all" && transaction.type !== filters.type) return false
    if (filters.category !== "all" && transaction.category !== filters.category) return false
    return true
  })

  // Apply sorting
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (filters.sortBy === "date") {
      return filters.sortOrder === "asc"
  ? new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()
  : new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime();

    }

    if (filters.sortBy === "amount") {
      return filters.sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
    }

    if (filters.sortBy === "category") {
      return filters.sortOrder === "asc" ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category)
    }

    return 0
  })

  if (sortedTransactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No transactions found. Add some transactions to get started!</div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedTransactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} onDelete={deleteTransaction} />
      ))}
    </div>
  )
}

export default TransactionList
