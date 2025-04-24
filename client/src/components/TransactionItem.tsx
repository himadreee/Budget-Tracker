"use client"

import { Trash2 } from "lucide-react"
import type { Transaction } from "../types"

interface TransactionItemProps {
  transaction: Transaction
  onDelete: (id: string) => void
}

const TransactionItem = ({ transaction, onDelete }: TransactionItemProps) => {
  const { id, description, amount, type, category, date } = transaction

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: "bg-orange-100 text-orange-800",
      transportation: "bg-blue-100 text-blue-800",
      entertainment: "bg-purple-100 text-purple-800",
      utilities: "bg-yellow-100 text-yellow-800",
      salary: "bg-green-100 text-green-800",
      gift: "bg-pink-100 text-pink-800",
      investment: "bg-indigo-100 text-indigo-800",
      other: "bg-gray-100 text-gray-800",
    }

    return colors[category] || colors.other
  }

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-10 rounded-full ${type === "income" ? "bg-green-500" : "bg-red-500"}`}></div>
          <div>
            <h3 className="font-medium">{description}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{formattedDate}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(category)}`}>{category}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className={`font-semibold ${type === "income" ? "text-green-600" : "text-red-600"}`}>
            {type === "income" ? "+" : "-"} {formattedAmount}
          </span>

          <button
            onClick={() => onDelete(id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete transaction"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionItem
