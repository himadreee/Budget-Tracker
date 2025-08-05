"use client";

import { createContext, useState, useEffect, type ReactNode } from "react";
import type { Transaction } from "../types";
import axios from "axios";
import { setupAxiosInterceptors } from "../utils/tokenManager";

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<boolean>;
  deleteTransaction: (id: string) => void;
  refreshTransactions: () => Promise<void>;
}

export const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  addTransaction: async () => false, // default fallback
  deleteTransaction: () => {},
  refreshTransactions: async () => {},
});

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider = ({ children }: TransactionProviderProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Setup axios interceptors only once when component mounts
  useEffect(() => {
    setupAxiosInterceptors(axios);
  }, []);

  // Function to fetch transactions from the API
  const fetchTransactions = async () => {
    try {
      const response = await axios.get<{transactions: any[]}>("http://127.0.0.1:8000/transactions/");

      // Convert the transaction data to match frontend format
      const fetchedTransactions = response.data.transactions.map((t: any) => ({
        id: t.id || Math.random().toString(), // Generate ID if not present
        description: t.description,
        amount: t.amount,
        type: t.type,
        category: t.category,
        transaction_date: new Date(t.transaction_date)
      }));

      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      // If there's an auth error, the interceptor will handle redirect to login
      setTransactions([]);
    }
  };

  // Fetch transactions when component mounts or when user logs in
  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, "id">): Promise<boolean> => {
    try {
      // Prepare the transaction data to match the backend model
      const transactionData = {
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        transaction_date: transaction.transaction_date.toISOString().split('T')[0] // Convert to YYYY-MM-DD format
      };

      const response = await axios.post<{ id: string; message: string }>(
        "http://127.0.0.1:8000/transactions/", 
        transactionData
      );
      
      console.log("Transaction created:", response.data.message);
      // Refresh transactions from the server after adding
      await fetchTransactions();
      return true;
    } catch (error) {
      console.error("Error adding transaction:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
      return false;
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, deleteTransaction, refreshTransactions: fetchTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};
