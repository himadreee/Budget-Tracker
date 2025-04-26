"use client"

import { useMemo } from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import type { Transaction } from "../types"

interface TransactionChartProps {
  transactions: Transaction[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#FF6B6B"]

const TransactionChart = ({ transactions }: TransactionChartProps) => {
  // Prepare data for monthly chart
  const monthlyData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      return {
        month: date.toLocaleString("default", { month: "short" }),
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
        yearMonth: `${date.getFullYear()}-${date.getMonth()}`,
      }
    }).reverse()

    const data = last6Months.map(({ month, year, monthIndex, yearMonth }) => {
      const monthlyTransactions = transactions.filter((t) => {
        const tDate = new Date(t.transaction_date)
        return tDate.getMonth() === monthIndex && tDate.getFullYear() === year
      })

      const income = monthlyTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

      const expense = monthlyTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

      return {
        name: `${month} ${year}`,
        Income: income,
        Expenses: expense,
        Balance: income - expense,
      }
    })

    return data
  }, [transactions])

  // Prepare data for category pie chart
  const categoryData = useMemo(() => {
    const expensesByCategory: Record<string, number> = {}

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        if (expensesByCategory[t.category]) {
          expensesByCategory[t.category] += t.amount
        } else {
          expensesByCategory[t.category] = t.amount
        }
      })

    return Object.entries(expensesByCategory).map(([name, value]) => ({
      name,
      value,
    }))
  }, [transactions])

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Monthly Overview</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, ""]} />
              <Legend />
              <Bar dataKey="Income" fill="#4ade80" />
              <Bar dataKey="Expenses" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Expense Categories</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}`, ""]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default TransactionChart
