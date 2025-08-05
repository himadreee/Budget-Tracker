import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { TransactionProvider } from "./context/TransactionContext"



function App() {
  return (
    <TransactionProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <div>
                <Header />
                <main className="container mx-auto px-4 py-8">
                  <Dashboard />
                </main>
              </div>
            } />
            <Route path="/transactions" element={
              <div>
                <Header />
                <main className="container mx-auto px-4 py-8">
                  <Transactions />
                </main>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </TransactionProvider>
  )
}

export default App
