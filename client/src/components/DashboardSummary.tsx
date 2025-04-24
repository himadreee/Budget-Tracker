import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react"

interface DashboardSummaryProps {
  income: number
  expenses: number
  balance: number
}

const DashboardSummary = ({ income, expenses, balance }: DashboardSummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Wallet className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Balance</p>
            <h2 className={`text-2xl font-bold ${balance >= 0 ? "text-blue-600" : "text-red-600"}`}>
              {formatCurrency(balance)}
            </h2>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <ArrowUpCircle className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Income</p>
            <h2 className="text-2xl font-bold text-green-600">{formatCurrency(income)}</h2>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-full">
            <ArrowDownCircle className="text-red-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Expenses</p>
            <h2 className="text-2xl font-bold text-red-600">{formatCurrency(expenses)}</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardSummary
