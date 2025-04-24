"use client"

import { useContext } from "react"
import { TransactionContext } from "../context/TransactionContext"
import TransactionForm from "../components/TransactionForm"
import DashboardSummary from "../components/DashboardSummary"
import TransactionChart from "../components/TransactionChart"

const Dashboard = () => {
  const { transactions } = useContext(TransactionContext)

  // Calculate totals
  const income = transactions.filter((t) => t.type === "income").reduce((acc, t) => acc + t.amount, 0)

  const expenses = transactions.filter((t) => t.type === "expense").reduce((acc, t) => acc + t.amount, 0)

  const balance = income - expenses

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <DashboardSummary income={income} expenses={expenses} balance={balance} />
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          <TransactionChart transactions={transactions} />
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
          <TransactionForm />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
