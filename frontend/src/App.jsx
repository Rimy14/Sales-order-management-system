import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SalesOrderPage from './pages/SalesOrderPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sales-order" element={<SalesOrderPage />} />
        <Route path="/sales-order/:id" element={<SalesOrderPage />} />
      </Routes>
    </div>
  )
}

export default App
