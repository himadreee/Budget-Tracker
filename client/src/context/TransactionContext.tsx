"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import type { Transaction } from "../types"

interface TransactionContextType {
  transactions: Transaction[]
  addTransaction: (transaction: Transaction) => void
  deleteTransaction: (id: string) => void
}

export const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  addTransaction: () => {},
  deleteTransaction: () => {},
})

interface TransactionProviderProps {
  children: ReactNode
}

export const TransactionProvider = ({ children }: TransactionProviderProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem("transactions")
    if (savedTransactions) {
      // Convert date strings back to Date objects
      return JSON.parse(savedTransactions).map((t: any) => ({
        ...t,
        date: new Date(t.date),
      }))
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction])
  }

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, deleteTransaction }}>
      {children}
    </TransactionContext.Provider>
  )
}
