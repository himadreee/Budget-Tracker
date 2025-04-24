export type TransactionType = "income" | "expense"

export interface Transaction {
  id: string
  description: string
  amount: number
  type: TransactionType
  category: string
  date: Date
}

export interface FilterOptions {
  type: "all" | TransactionType
  category: string
  sortBy: "date" | "amount" | "category"
  sortOrder: "asc" | "desc"
}
