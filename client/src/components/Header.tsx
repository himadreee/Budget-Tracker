import { Link, useLocation } from "react-router-dom"
import { Wallet, BarChart3, Receipt, LogOut, User } from "lucide-react"
import { useState } from "react"

const Header = () => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <Link 
            to="/dashboard" 
            className="flex items-center gap-3 group hover:opacity-80 transition-all duration-300"
          >
            <div className="relative">
              <div className="h-10 w-10 bg-slate-800 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                <Wallet size={24} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full"></div>
            </div>
            <div>
              <span className="text-xl font-bold text-slate-800">
                Budget Tracker
              </span>
              <div className="text-xs text-gray-500 font-medium">Financial Management</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/dashboard')
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-gray-600 hover:text-slate-800 hover:bg-gray-100'
              }`}
            >
              <BarChart3 size={18} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/transactions"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/transactions')
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-gray-600 hover:text-slate-800 hover:bg-gray-100'
              }`}
            >
              <Receipt size={18} />
              <span>Transactions</span>
            </Link>
          </nav>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200"
            >
              <div className="h-8 w-8 bg-slate-700 rounded-lg flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="hidden sm:block font-medium text-gray-700">Account</span>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800">Welcome back!</p>
                  <p className="text-xs text-gray-500">Manage your account</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex gap-2">
            <Link
              to="/dashboard"
              className={`p-2 rounded-lg transition-all duration-200 ${
                isActive('/dashboard')
                  ? 'bg-slate-800 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 size={20} />
            </Link>
            <Link
              to="/transactions"
              className={`p-2 rounded-lg transition-all duration-200 ${
                isActive('/transactions')
                  ? 'bg-slate-800 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Receipt size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Simple bottom border */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    </header>
  )
}

export default Header
