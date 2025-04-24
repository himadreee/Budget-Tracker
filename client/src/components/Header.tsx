import { Link } from "react-router-dom"
import { Wallet } from "lucide-react"

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
            <Wallet size={24} />
            <span>Budget Tracker</span>
          </Link>
          <nav>
            <ul className="flex gap-6">
              <li>
                <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/transactions" className="text-gray-700 hover:text-blue-600 font-medium">
                  Transactions
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
