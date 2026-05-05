import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchSalesOrders } from '../redux/slices/salesOrdersSlice'

const HomePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { orders, loading, error } = useSelector((state) => state.salesOrders)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(fetchSalesOrders())
  }, [dispatch])

  const handleAddNew = () => {
    navigate('/sales-order')
  }

  const handleRowDoubleClick = (orderId) => {
    navigate(`/sales-order/${orderId}`)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount) => {
    if (!amount) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount))
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.invoiceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.referenceNo?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate stats
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (parseFloat(o.totalInclAmount) || 0),
    0
  )
  const totalTax = orders.reduce(
    (sum, o) => sum + (parseFloat(o.totalTaxAmount) || 0),
    0
  )
  const avgOrderValue =
    orders.length > 0 ? totalRevenue / orders.length : 0

  const stats = [
    {
      label: 'Total Orders',
      value: orders.length,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'bg-primary-50 text-primary-600',
      accent: 'border-l-primary-500',
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-emerald-50 text-emerald-600',
      accent: 'border-l-emerald-500',
    },
    {
      label: 'Total Tax',
      value: formatCurrency(totalTax),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
        </svg>
      ),
      color: 'bg-amber-50 text-amber-600',
      accent: 'border-l-amber-500',
    },
    {
      label: 'Avg. Order Value',
      value: formatCurrency(avgOrderValue),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'bg-cyan-50 text-cyan-600',
      accent: 'border-l-cyan-500',
    },
  ]

  return (
    <div className="min-h-screen px-8 py-7 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-surface-500 text-sm mt-1">
            Overview of your sales orders and performance
          </p>
        </div>
        <button id="add-new-order-btn" onClick={handleAddNew} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Order
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 animate-slide-up">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`stat-card border-l-4 ${stat.accent}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-surface-900 tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Orders Table Card */}
      <div className="bg-white rounded-2xl border border-surface-100 shadow-soft overflow-hidden animate-slide-up" style={{ animationDelay: '200ms' }}>
        {/* Table Header */}
        <div className="px-6 py-5 border-b border-surface-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-surface-900">Recent Orders</h2>
            <p className="text-xs text-surface-400 mt-0.5">
              {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
            </p>
          </div>
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="search-orders-input"
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-surface-50 border border-surface-200 rounded-xl text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                placeholder-surface-400 transition-all duration-200"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            <p className="text-sm text-surface-400">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-rose-600">Error loading orders</p>
            <p className="text-xs text-surface-400">{error}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-surface-50 flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-sm font-medium text-surface-600">No orders found</p>
            <p className="text-xs text-surface-400">
              {searchTerm
                ? 'Try adjusting your search'
                : 'Click "New Order" to create your first order'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table id="orders-table" className="w-full">
              <thead>
                <tr className="border-b border-surface-100 bg-surface-50/50">
                  <th className="table-header">Invoice No</th>
                  <th className="table-header">Customer</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Reference</th>
                  <th className="table-header text-right">Excl. Amount</th>
                  <th className="table-header text-right">Tax</th>
                  <th className="table-header text-right">Total</th>
                  <th className="table-header text-center w-20">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr
                    key={order.id}
                    onDoubleClick={() => handleRowDoubleClick(order.id)}
                    className="table-row-hover border-b border-surface-50 cursor-pointer group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="table-cell">
                      <span className="font-semibold text-primary-600">
                        #{order.invoiceNo}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary-600">
                            {order.customerName?.charAt(0) || '?'}
                          </span>
                        </div>
                        <span className="font-medium text-surface-800">
                          {order.customerName}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell text-surface-500">
                      {formatDate(order.invoiceDate)}
                    </td>
                    <td className="table-cell text-surface-500">
                      {order.referenceNo || (
                        <span className="text-surface-300">—</span>
                      )}
                    </td>
                    <td className="table-cell text-right font-medium text-surface-700">
                      {formatCurrency(order.totalExclAmount)}
                    </td>
                    <td className="table-cell text-right text-surface-500">
                      {formatCurrency(order.totalTaxAmount)}
                    </td>
                    <td className="table-cell text-right">
                      <span className="font-bold text-surface-900">
                        {formatCurrency(order.totalInclAmount)}
                      </span>
                    </td>
                    <td className="table-cell text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRowDoubleClick(order.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200
                          p-1.5 rounded-lg hover:bg-primary-50 text-surface-400 hover:text-primary-600"
                        title="Edit order"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {filteredOrders.length > 0 && (
          <div className="px-6 py-3 bg-surface-50/50 border-t border-surface-100">
            <p className="text-xs text-surface-400">
              Double-click any row to view and edit the order
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
