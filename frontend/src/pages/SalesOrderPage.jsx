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

    // Recalculate amounts when quantity, price, or tax rate changes
    if (field === 'quantity' || field === 'price' || field === 'taxRate') {
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
        alert('Order updated successfully!')
      } else {
        await dispatch(createSalesOrder(orderData)).unwrap()
        alert('Order created successfully!')
      }
      navigate('/')
    } catch (error) {
      alert('Error saving order: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">Sales Order</h1>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Home
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            {/* Top Section */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name *
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={handleClientChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select Customer</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.customerName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address 1
                  </label>
                  <input
                    type="text"
                    name="address1"
                    value={formData.address1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address 2
                  </label>
                  <input
                    type="text"
                    name="address2"
                    value={formData.address2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address 3
                  </label>
                  <input
                    type="text"
                    name="address3"
                    value={formData.address3}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Post Code
                  </label>
                  <input
                    type="text"
                    name="postCode"
                    value={formData.postCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice No *
                  </label>
                  <input
                    type="text"
                    name="invoiceNo"
                    value={formData.invoiceNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Date *
                  </label>
                  <input
                    type="date"
                    name="invoiceDate"
                    value={formData.invoiceDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference No
                  </label>
                  <textarea
                    name="referenceNo"
                    value={formData.referenceNo}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">Order Items</h2>
                <button
                  type="button"
                  onClick={addNewRow}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  + Add Item
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                        Item Code
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                        Description
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                        Note
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                        Quantity
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                        Price
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                        Tax %
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                        Excl Amount
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                        Tax Amount
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                        Incl Amount
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orderItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2">
                          <select
                            value={item.itemId}
                            onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                            className="w-32 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          >
                            <option value="">Select</option>
                            {items.map((itm) => (
                              <option key={itm.id} value={itm.id}>
                                {itm.itemCode}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={item.itemId}
                            onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                            className="w-48 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          >
                            <option value="">Select</option>
                            {items.map((itm) => (
                              <option key={itm.id} value={itm.id}>
                                {itm.description}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={item.note}
                            onChange={(e) => handleItemChange(index, 'note', e.target.value)}
                            className="w-32 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                            min="1"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={item.price}
                            readOnly
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={item.taxRate}
                            onChange={(e) => handleItemChange(index, 'taxRate', e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                            step="0.01"
                            min="0"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={item.exclAmount.toFixed(2)}
                            readOnly
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={item.taxAmount.toFixed(2)}
                            readOnly
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={item.inclAmount.toFixed(2)}
                            readOnly
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50 font-medium"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            onClick={() => removeRow(index)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-6">
              <div className="w-96 space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Total Excl:</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ${totals.totalExcl}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Total Tax:</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ${totals.totalTax}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t-2 border-gray-300">
                  <span className="font-bold text-gray-800">Total Incl:</span>
                  <span className="text-xl font-bold text-primary-600">
                    ${totals.totalIncl}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-start gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-8 py-3 rounded-md transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : id ? 'Update Order' : 'Save Order'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-8 py-3 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SalesOrderPage
