import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchClients } from '../redux/slices/clientsSlice'
import { fetchItems } from '../redux/slices/itemsSlice'
import {
  createSalesOrder,
  updateSalesOrder,
  fetchSalesOrderById,
  clearCurrentOrder,
} from '../redux/slices/salesOrdersSlice'

const SalesOrderPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  
  const { clients } = useSelector((state) => state.clients)
  const { items } = useSelector((state) => state.items)
  const { currentOrder, loading } = useSelector((state) => state.salesOrders)

  const [formData, setFormData] = useState({
    invoiceNo: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    referenceNo: '',
    clientId: '',
    address1: '',
    address2: '',
    address3: '',
    state: '',
    postCode: '',
  })

  const [orderItems, setOrderItems] = useState([])
  const [totals, setTotals] = useState({
    totalExcl: 0,
    totalTax: 0,
    totalIncl: 0,
  })
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    dispatch(fetchClients())
    dispatch(fetchItems())

    if (id) {
      dispatch(fetchSalesOrderById(id))
    }

    return () => {
      dispatch(clearCurrentOrder())
    }
  }, [dispatch, id])

  useEffect(() => {
    if (currentOrder && id) {
      setFormData({
        invoiceNo: currentOrder.invoiceNo,
        invoiceDate: currentOrder.invoiceDate,
        referenceNo: currentOrder.referenceNo || '',
        clientId: currentOrder.clientId,
        address1: currentOrder.address1 || '',
        address2: currentOrder.address2 || '',
        address3: currentOrder.address3 || '',
        state: currentOrder.state || '',
        postCode: currentOrder.postCode || '',
      })
      setOrderItems(currentOrder.items || [])
    }
  }, [currentOrder, id])

  useEffect(() => {
    calculateTotals()
  }, [orderItems])

  const handleClientChange = (e) => {
    const clientId = e.target.value
    setFormData({ ...formData, clientId })

    if (clientId) {
      const selectedClient = clients.find((c) => c.id === parseInt(clientId))
      if (selectedClient) {
        setFormData({
          ...formData,
          clientId,
          address1: selectedClient.address1 || '',
          address2: selectedClient.address2 || '',
          address3: selectedClient.address3 || '',
          state: selectedClient.state || '',
          postCode: selectedClient.postCode || '',
        })
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const addNewRow = () => {
    setOrderItems([
      ...orderItems,
      {
        id: null,
        itemId: '',
        itemCode: '',
        description: '',
        note: '',
        quantity: 1,
        price: 0,
        taxRate: 0,
        exclAmount: 0,
        taxAmount: 0,
        inclAmount: 0,
      },
    ])
  }

  const removeRow = (index) => {
    const newItems = orderItems.filter((_, i) => i !== index)
    setOrderItems(newItems)
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderItems]
    newItems[index][field] = value

    // If item code or description changed, update related fields
    if (field === 'itemId') {
      const selectedItem = items.find((item) => item.id === parseInt(value))
      if (selectedItem) {
        newItems[index].itemId = selectedItem.id
        newItems[index].itemCode = selectedItem.itemCode
        newItems[index].description = selectedItem.description
        newItems[index].price = selectedItem.price
      }
    }

    // Recalculate amounts when quantity, price, tax rate, or item selection changes
    if (field === 'quantity' || field === 'price' || field === 'taxRate' || field === 'itemId') {
      const quantity = parseFloat(newItems[index].quantity) || 0
      const price = parseFloat(newItems[index].price) || 0
      const taxRate = parseFloat(newItems[index].taxRate) || 0

      const exclAmount = quantity * price
      const taxAmount = (exclAmount * taxRate) / 100
      const inclAmount = exclAmount + taxAmount

      newItems[index].exclAmount = exclAmount
      newItems[index].taxAmount = taxAmount
      newItems[index].inclAmount = inclAmount
    }

    setOrderItems(newItems)
  }

  const calculateTotals = () => {
    const totalExcl = orderItems.reduce((sum, item) => sum + (parseFloat(item.exclAmount) || 0), 0)
    const totalTax = orderItems.reduce((sum, item) => sum + (parseFloat(item.taxAmount) || 0), 0)
    const totalIncl = orderItems.reduce((sum, item) => sum + (parseFloat(item.inclAmount) || 0), 0)

    setTotals({
      totalExcl: totalExcl.toFixed(2),
      totalTax: totalTax.toFixed(2),
      totalIncl: totalIncl.toFixed(2),
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount) || 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.clientId) {
      alert('Please select a customer')
      return
    }

    if (!formData.invoiceNo) {
      alert('Please enter an invoice number')
      return
    }

    if (orderItems.length === 0) {
      alert('Please add at least one item')
      return
    }

    const orderData = {
      ...formData,
      clientId: parseInt(formData.clientId),
      items: orderItems.map((item) => ({
        itemId: parseInt(item.itemId),
        note: item.note,
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price),
        taxRate: parseFloat(item.taxRate),
        exclAmount: parseFloat(item.exclAmount),
        taxAmount: parseFloat(item.taxAmount),
        inclAmount: parseFloat(item.inclAmount),
      })),
      totalExclAmount: parseFloat(totals.totalExcl),
      totalTaxAmount: parseFloat(totals.totalTax),
      totalInclAmount: parseFloat(totals.totalIncl),
    }

    try {
      if (id) {
        await dispatch(updateSalesOrder({ id: parseInt(id), orderData })).unwrap()
      } else {
        await dispatch(createSalesOrder(orderData)).unwrap()
      }
      setShowSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (error) {
      alert('Error saving order: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen px-4 py-5 md:px-8 md:py-7 animate-fade-in">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 animate-slide-down">
          <div className="flex items-center gap-3 bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium text-sm">
              Order {id ? 'updated' : 'created'} successfully!
            </span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-xl bg-white border border-surface-200 flex items-center justify-center
              hover:bg-surface-50 transition-all duration-200 text-surface-500 hover:text-surface-700"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-surface-900 tracking-tight">
              {id ? 'Edit Order' : 'New Sales Order'}
            </h1>
            <p className="text-surface-500 text-sm mt-0.5">
              {id ? `Editing order #${formData.invoiceNo}` : 'Fill in the details below to create a new order'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Customer & Invoice Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Customer Details Card */}
          <div className="bg-white rounded-2xl border border-surface-100 shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-100 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-sm font-semibold text-surface-800">Customer Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Customer Name <span className="text-rose-400">*</span></label>
                <select
                  id="customer-select"
                  value={formData.clientId}
                  onChange={handleClientChange}
                  className="select-field"
                  required
                >
                  <option value="">Select a customer</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.customerName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="form-label">Address Line 1</label>
                  <input
                    type="text"
                    name="address1"
                    value={formData.address1}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Street address"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Address Line 2</label>
                    <input
                      type="text"
                      name="address2"
                      value={formData.address2}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Building, suite"
                    />
                  </div>
                  <div>
                    <label className="form-label">Address Line 3</label>
                    <input
                      type="text"
                      name="address3"
                      value={formData.address3}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Floor, unit"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="form-label">Post Code</label>
                    <input
                      type="text"
                      name="postCode"
                      value={formData.postCode}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Post code"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Details Card */}
          <div className="bg-white rounded-2xl border border-surface-100 shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-100 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-sm font-semibold text-surface-800">Invoice Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Invoice No <span className="text-rose-400">*</span></label>
                <input
                  id="invoice-no-input"
                  type="text"
                  name="invoiceNo"
                  value={formData.invoiceNo}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g. INV-001"
                  required
                />
              </div>

              <div>
                <label className="form-label">Invoice Date <span className="text-rose-400">*</span></label>
                <input
                  id="invoice-date-input"
                  type="date"
                  name="invoiceDate"
                  value={formData.invoiceDate}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="form-label">Reference / Notes</label>
                <textarea
                  name="referenceNo"
                  value={formData.referenceNo}
                  onChange={handleInputChange}
                  rows="5"
                  className="input-field resize-none"
                  placeholder="Any additional notes or reference..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Section */}
        <div className="bg-white rounded-2xl border border-surface-100 shadow-soft overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-surface-800">Order Items</h2>
                <p className="text-xs text-surface-400">
                  {orderItems.length} item{orderItems.length !== 1 ? 's' : ''} added
                </p>
              </div>
            </div>
            <button
              id="add-item-btn"
              type="button"
              onClick={addNewRow}
              className="btn-success text-xs px-4 py-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table id="order-items-table" className="w-full">
              <thead>
                <tr className="bg-surface-50/80 border-b border-surface-100">
                  <th className="table-header">Item Code</th>
                  <th className="table-header">Description</th>
                  <th className="table-header">Note</th>
                  <th className="table-header text-center w-20">Qty</th>
                  <th className="table-header text-right">Price</th>
                  <th className="table-header text-center w-20">Tax %</th>
                  <th className="table-header text-right">Excl. Amt</th>
                  <th className="table-header text-right">Tax Amt</th>
                  <th className="table-header text-right">Incl. Amt</th>
                  <th className="table-header text-center w-16"></th>
                </tr>
              </thead>
              <tbody>
                {orderItems.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-10 text-center">
                      <p className="text-sm text-surface-400">No items added yet</p>
                      <p className="text-xs text-surface-300 mt-1">Click "Add Item" to get started</p>
                    </td>
                  </tr>
                ) : (
                  orderItems.map((item, index) => (
                    <tr key={index} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors duration-150">
                      <td className="px-4 py-3">
                        <select
                          value={item.itemId}
                          onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                          className="w-28 px-2.5 py-1.5 bg-white border border-surface-200 rounded-lg text-sm
                            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                            transition-all duration-200"
                        >
                          <option value="">Select</option>
                          {items.map((itm) => (
                            <option key={itm.id} value={itm.id}>
                              {itm.itemCode}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={item.itemId}
                          onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                          className="w-44 px-2.5 py-1.5 bg-white border border-surface-200 rounded-lg text-sm
                            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                            transition-all duration-200"
                        >
                          <option value="">Select</option>
                          {items.map((itm) => (
                            <option key={itm.id} value={itm.id}>
                              {itm.description}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.note}
                          onChange={(e) => handleItemChange(index, 'note', e.target.value)}
                          className="w-28 px-2.5 py-1.5 bg-white border border-surface-200 rounded-lg text-sm
                            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                            transition-all duration-200"
                          placeholder="Note"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-16 px-2.5 py-1.5 bg-white border border-surface-200 rounded-lg text-sm text-center
                            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                            transition-all duration-200"
                          min="1"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.price}
                          readOnly
                          className="w-24 px-2.5 py-1.5 bg-surface-50 border border-surface-100 rounded-lg text-sm text-right text-surface-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.taxRate}
                          onChange={(e) => handleItemChange(index, 'taxRate', e.target.value)}
                          className="w-16 px-2.5 py-1.5 bg-white border border-surface-200 rounded-lg text-sm text-center
                            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                            transition-all duration-200"
                          step="0.01"
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-surface-700">
                        {formatCurrency(item.exclAmount)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-surface-500">
                        {formatCurrency(item.taxAmount)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-bold text-surface-900">
                        {formatCurrency(item.inclAmount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeRow(index)}
                          className="p-1.5 rounded-lg text-surface-300 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200"
                          title="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals & Actions */}
        <div className="flex flex-col-reverse md:flex-row items-stretch md:items-start justify-between gap-6">
          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end md:justify-start">
            <button
              id="save-order-btn"
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {id ? 'Update Order' : 'Save Order'}
                </>
              )}
            </button>
            <button
              id="cancel-btn"
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary px-8 py-3 text-base"
            >
              Cancel
            </button>
          </div>

          {/* Totals Card */}
          <div className="bg-white rounded-2xl border border-surface-100 shadow-soft w-full md:w-80 overflow-hidden">
            <div className="px-5 py-3 bg-surface-50/80 border-b border-surface-100">
              <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Order Summary</span>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-surface-500">Subtotal</span>
                <span className="text-sm font-semibold text-surface-800">
                  {formatCurrency(totals.totalExcl)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-surface-500">Tax</span>
                <span className="text-sm font-semibold text-surface-800">
                  {formatCurrency(totals.totalTax)}
                </span>
              </div>
              <div className="border-t border-surface-100 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-surface-900">Total</span>
                  <span className="text-xl font-bold gradient-text">
                    {formatCurrency(totals.totalIncl)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SalesOrderPage
