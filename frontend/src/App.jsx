import React from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SalesOrderPage from './pages/SalesOrderPage'

const Sidebar = () => {
  const location = useLocation()

  return (
    <aside className="sidebar-gradient w-64 min-h-screen flex flex-col fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-base tracking-tight">SalesFlow</h1>
            <p className="text-primary-300 text-[10px] font-medium uppercase tracking-widest">Order Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
              isActive || location.pathname === '/'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-primary-200 hover:bg-white/8 hover:text-white'
            }`
          }
          end
        >
          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </NavLink>

        <NavLink
          to="/sales-order"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
              isActive || location.pathname.startsWith('/sales-order')
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-primary-200 hover:bg-white/8 hover:text-white'
            }`
          }
        >
          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Order
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary-400/30 flex items-center justify-center">
            <span className="text-white text-xs font-bold">SP</span>
          </div>
          <div>
            <p className="text-white text-xs font-medium">SPIL Admin</p>
            <p className="text-primary-300 text-[10px]">Sales Manager</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-surface-50 flex">
      <Sidebar />
      <main className="flex-1 ml-64">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sales-order" element={<SalesOrderPage />} />
          <Route path="/sales-order/:id" element={<SalesOrderPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
