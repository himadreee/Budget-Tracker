"use client";

import { createContext, useState, useEffect, type ReactNode } from "react";
import type { Transaction } from "../types";
import axios from "axios";

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<boolean>;
  deleteTransaction: (id: string) => void;
}

export const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  addTransaction: async () => false, // default fallback
  deleteTransaction: () => {},
});

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider = ({ children }: TransactionProviderProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      return JSON.parse(savedTransactions).map((t: any) => ({
        ...t,
        date: new Date(t.date),
      }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = async (transaction: Omit<Transaction, "id">): Promise<boolean> => {
    try {
      const response = await axios.post<{ id: string }>("http://127.0.0.1:8000/transactions/", transaction);
      const savedId = response.data.id;
      setTransactions((prev) => [...prev, { ...transaction, id: savedId }]);
      return true;
    } catch (error) {
      console.error("Error adding transaction:", error);
      return false;
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, deleteTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};
