export type TransactionType = "income" | "expense"

export interface Transaction {
  id?: string; // optional, because new transactions won't have it yet
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  transaction_date: Date;
}


export interface FilterOptions {
  type: "all" | TransactionType
  category: string
  sortBy: "date" | "amount" | "category"
  sortOrder: "asc" | "desc"
}
