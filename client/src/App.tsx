import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { TransactionProvider } from "./context/TransactionContext"



function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <TransactionProvider>
              <div>
                <Header />
                <main className="container mx-auto px-4 py-8">
                  <Dashboard />
                </main>
              </div>
            </TransactionProvider>
          } />
          <Route path="/transactions" element={
            <TransactionProvider>
              <div>
                <Header />
                <main className="container mx-auto px-4 py-8">
                  <Transactions />
                </main>
              </div>
            </TransactionProvider>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
