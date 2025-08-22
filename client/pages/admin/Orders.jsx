"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import axiosInstance from "../../utils/axiosInstance"
import { Link } from "react-router-dom"

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const { data } = await axiosInstance.get("/orders")
            setOrders(data || [])
        } catch (err) {
            console.error(err)
            setOrders([])
            toast.error("Failed to fetch orders")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axiosInstance.put(`/orders/${orderId}`, { deliveryStatus: newStatus })
            toast.success("Order status updated successfully!")
            fetchOrders()
        } catch (err) {
            console.error(err)
            toast.error("Failed to update order status")
        }
    }

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case "delivered":
                return "bg-green-100 text-green-800 border-green-200"
            case "shipped":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "processing":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getPaymentStatusColor = (status) => {
        return status === "paid" ? "text-green-600" : "text-red-600"
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <span className="ml-3 text-lg text-gray-600">Loading orders...</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen bg-gradient-to-br p-5 from-blue-50 to-indigo-100 ">
            <Link
                to="/admin"
                className="inline-flex mb-3 items-center px-3 py-1.5 text-sm font-medium text-black bg-white rounded-md shadow hover:bg-gray-100 transition"
            >
                ← Back
            </Link>
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Order Management
                            </h1>
                            <p className="text-gray-600 mt-2">Track and manage customer orders</p>
                        </div>
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg">
                            <span className="font-semibold">{orders.length}</span> Total Orders
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1200px]">
                            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider min-w-[120px]">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider min-w-[250px]">
                                        Customer
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider min-w-[200px]">
                                        Items
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider min-w-[100px]">
                                        Total
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider min-w-[120px]">
                                        Payment
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider min-w-[100px]">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider min-w-[150px]">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider min-w-[140px]">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {Array.isArray(orders) && orders.length > 0 ? (
                                    orders.map((order, index) => (
                                        <tr
                                            key={order._id}
                                            className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                        >
                                            <td className="px-6 py-4 min-w-[120px]">
                                                <div className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                                                    #{order._id.slice(-8)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 min-w-[250px]">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                            {order.user?.name?.charAt(0) || "U"}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 min-w-0">
                                                        <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                                            {order.user?.name || "Unknown User"}
                                                        </div>
                                                        <div className="text-sm text-gray-500 whitespace-nowrap">{order.user?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 min-w-[200px]">
                                                <div className="space-y-1">
                                                    {order.items.map((item) => (
                                                        <div key={item._id} className="text-sm whitespace-nowrap">
                                                            <span className="font-medium text-gray-900">{item.product?.name}</span>
                                                            <span className="text-gray-500"> × {item.quantity}</span>
                                                            <span className="text-indigo-600 font-semibold"> (₹{item.price})</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 min-w-[100px]">
                                                <div className="text-lg font-bold text-green-600 whitespace-nowrap">₹{order.totalPrice}</div>
                                            </td>
                                            <td className="px-6 py-4 min-w-[120px]">
                                                <div className="space-y-1">
                                                    <div className="text-sm text-gray-900 capitalize whitespace-nowrap">
                                                        {order.paymentMethod}
                                                    </div>
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getPaymentStatusColor(order.paymentStatus)} bg-opacity-10`}
                                                    >
                                                        {order.paymentStatus}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 min-w-[100px]">
                                                <span
                                                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${getStatusBadgeColor(order.deliveryStatus)}`}
                                                >
                                                    {order.deliveryStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 min-w-[150px] whitespace-nowrap">
                                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 min-w-[140px]">
                                                <select
                                                    value={order.deliveryStatus}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className="block w-fit px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                                                <p className="text-gray-500">Orders will appear here once customers start placing them.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Orders
