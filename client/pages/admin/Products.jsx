"use client"

import { useEffect, useState } from "react"
import axiosInstance from "../../utils/axiosInstance"
import toast, { Toaster } from "react-hot-toast"
import { Link } from "react-router-dom"

const Products = () => {
    const [products, setProducts] = useState([])
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: 0,
        stockQuantity: 0,
        image: null,
    })

    const [editingProduct, setEditingProduct] = useState(null)
    const [editData, setEditData] = useState({})

    const fetchProducts = async () => {
        try {
            const { data } = await axiosInstance.get("/products")
            setProducts(data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    // Add new product
    const handleAddProduct = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append("name", newProduct.name)
            formData.append("description", newProduct.description)
            formData.append("price", newProduct.price)
            formData.append("stockQuantity", newProduct.stockQuantity)
            formData.append("image", newProduct.image)

            await axiosInstance.post("/products/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            setNewProduct({
                name: "",
                description: "",
                price: 0,
                stockQuantity: 0,
                image: null,
            })

            toast.success("Item added successfully!")
            fetchProducts()
        } catch (err) {
            console.error(err)
        }
    }

    // Delete product
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return
        try {
            await axiosInstance.delete(`/products/delete/${id}`)
            toast.success("Deleted successfully!")
            fetchProducts()
        } catch (err) {
            console.error(err)
        }
    }

    // Start editing
    const handleEdit = (product) => {
        setEditingProduct(product._id)
        setEditData({
            name: product.name,
            description: product.description,
            price: product.price,
            stockQuantity: product.stockQuantity,
            image: null,
        })
    }

    // Save update
    const handleUpdate = async (id) => {
        try {
            const formData = new FormData()
            Object.keys(editData).forEach((key) => {
                if (editData[key] !== null) formData.append(key, editData[key])
            })

            await axiosInstance.put(`/products/update/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            setEditingProduct(null)
            setEditData({})
            toast.success("Updated successfully!")
            fetchProducts()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "#10b981",
                        color: "#fff",
                        fontWeight: "500",
                    },
                }}
            />

            <div className="max-w-7xl mx-auto">
                <Link
                    to="/admin"
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-black bg-white rounded-md shadow hover:bg-gray-100 transition"
                >
                    ← Back
                </Link>
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">Product Management</h1>
                    <p className="text-slate-600">Manage your product inventory with ease</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-slate-200 mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white">Add New Product</h2>
                    </div>

                    <form onSubmit={handleAddProduct} className="p-6">
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Product Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter product name"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Price (₹)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Stock Quantity</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={newProduct.stockQuantity}
                                    onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Product Image</label>
                                <input
                                    type="file"
                                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                    required
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-700">Description</label>
                                <textarea
                                    placeholder="Enter product description"
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                                    rows="3"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Add Product
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white">Products Inventory</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Description</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Price</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Stock</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Image</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                                        {editingProduct === product._id ? (
                                            <>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        value={editData.name}
                                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <textarea
                                                        value={editData.description}
                                                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                                        rows="2"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        value={editData.price}
                                                        onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        value={editData.stockQuantity}
                                                        onChange={(e) => setEditData({ ...editData, stockQuantity: e.target.value })}
                                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="file"
                                                        onChange={(e) => setEditData({ ...editData, image: e.target.files[0] })}
                                                        className="w-full text-sm file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
                                                            onClick={() => handleUpdate(product._id)}
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            className="bg-slate-500 hover:bg-slate-600 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
                                                            onClick={() => setEditingProduct(null)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-900">{product.name}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-slate-600 max-w-xs truncate">{product.description}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-emerald-600">₹{product.price}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stockQuantity > 10
                                                            ? "bg-emerald-100 text-emerald-800"
                                                            : product.stockQuantity > 0
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        {product.stockQuantity} units
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {product.image && (
                                                        <img
                                                            src={product.image || "/placeholder.svg"}
                                                            alt={product.name}
                                                            className="h-16 w-16 object-cover rounded-lg border border-slate-200 shadow-sm"
                                                        />
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
                                                            onClick={() => handleEdit(product)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
                                                            onClick={() => handleDelete(product._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products
