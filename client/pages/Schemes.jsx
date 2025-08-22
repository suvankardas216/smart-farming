"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { getSchemes, deleteScheme, updateScheme } from "../services/schemeService"
import { createScheme } from "../services/schemeService"
import { Link } from "react-router-dom"

const categories = [
    "Income Support",
    "Insurance & Risk Management",
    "Energy & Technology",
    "Infrastructure Development",
    "Organic & Sustainable Farming",
    "Credit & Finance",
    "Water Management & Irrigation",
    "Crop Production & Development",
    "Mechanization & Equipment",
    "Livestock & Dairy",
    "Fisheries & Aquaculture",
    "Marketing & Trade",
    "Processing & Value Addition",
    "Soil & Nutrient Management",
    "Women & Social Welfare",
    "Environmental & Climate",
    "Social Security & Welfare",
    "Cooperative & FPO Development",
    "Extension & Training",
]

const Schemes = () => {
    const { user } = useContext(AuthContext)
    const [schemes, setSchemes] = useState([])
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newScheme, setNewScheme] = useState({
        name: "",
        description: "",
        link: "",
        category: "",
    })

    const openCreateModal = () => setShowCreateModal(true)
    const closeCreateModal = () => {
        setShowCreateModal(false)
        setNewScheme({ name: "", description: "", link: "", category: "" })
    }

    // Handle Create Submit
    const handleCreateSubmit = async (e) => {
        e.preventDefault()
        try {
            await createScheme(newScheme)
            closeCreateModal()
            fetchAllSchemes() // Refresh list
        } catch (err) {
            console.error(err)
        }
    }
    // For Edit Modal
    const [editingScheme, setEditingScheme] = useState(null)
    const [editForm, setEditForm] = useState({ name: "", description: "", link: "", category: "" })

    const fetchAllSchemes = async () => {
        try {
            const params = { page, limit: 10 }
            if (search) params.search = search
            if (filter) params.category = filter

            const data = await getSchemes(params)
            setSchemes(Array.isArray(data.results) ? data.results : [])
            setTotalPages(data.totalPages || 1)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchAllSchemes()
    }, [search, filter, page])

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this scheme?")) return
        try {
            await deleteScheme(id)
            fetchAllSchemes()
        } catch (err) {
            console.error(err)
        }
    }

    const openEditModal = (scheme) => {
        setEditingScheme(scheme)
        setEditForm({
            name: scheme.name,
            description: scheme.description,
            link: scheme.link,
            category: scheme.category,
        })
    }

    const closeEditModal = () => {
        setEditingScheme(null)
        setEditForm({ name: "", description: "", link: "", category: "" })
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        try {
            await updateScheme(editingScheme._id, editForm)
            closeEditModal()
            fetchAllSchemes()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">

            <div className="container mx-auto mt-15 p-6 max-w-7xl">

                <div className="mb-8">

                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-2">
                        Government Schemes
                    </h1>
                    <p className="text-gray-300 text-lg">Discover and manage government schemes for agricultural development</p>
                    
                </div>

                {user?.role === "admin" && (
                    <div className="mb-6">
                        <button
                            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 border border-emerald-400/20"
                            onClick={openCreateModal}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Scheme
                        </button>
                    </div>
                )}

                <div className="bg-gradient-to-br from-slate-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-emerald-500/20 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <svg
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search schemes..."
                                    className="w-full pl-10 pr-4 py-3 border border-emerald-500/30 rounded-xl focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-400 transition-all duration-200 bg-slate-800/50 backdrop-blur-sm text-white placeholder-gray-400"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="md:w-64">
                            <select
                                className="w-full px-4 py-3 border border-emerald-500/30 rounded-xl focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-400 transition-all duration-200 bg-slate-800/50 backdrop-blur-sm text-white"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {schemes.map((scheme) => (
                        <div
                            key={scheme._id}
                            className="bg-gradient-to-br from-slate-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 transform hover:scale-105 group"
                        >
                            <div className="mb-4">
                                <h2 className="font-bold text-xl text-white mb-2 group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2">
                                    {scheme.name}
                                </h2>
                                <div className="inline-block px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30">
                                    {scheme.category}
                                </div>
                            </div>

                            <p className="text-gray-300 mb-4 text-sm leading-relaxed line-clamp-3">{scheme.description}</p>

                            <a
                                href={scheme.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold text-sm transition-colors duration-200 mb-4"
                            >
                                Learn More
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>

                            {user?.role === "admin" && (
                                <div className="flex gap-2 pt-4 border-t border-emerald-500/20">
                                    <button
                                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 border border-amber-400/20"
                                        onClick={() => openEditModal(scheme)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 border border-red-400/20"
                                        onClick={() => handleDelete(scheme._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-center items-center gap-4">
                    <button
                        className="px-6 py-3 bg-gradient-to-r from-slate-800/95 to-gray-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-xl hover:border-emerald-400/50 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-white"
                        disabled={page === 1}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    >
                        Previous
                    </button>
                    <div className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold shadow-lg border border-emerald-400/20">
                        {page} of {totalPages}
                    </div>
                    <button
                        className="px-6 py-3 bg-gradient-to-r from-slate-800/95 to-gray-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-xl hover:border-emerald-400/50 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-white"
                        disabled={page === totalPages}
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    >
                        Next
                    </button>
                </div>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-slate-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-emerald-500/20">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                                    Add New Scheme
                                </h2>
                                <button
                                    onClick={closeCreateModal}
                                    className="p-2 hover:bg-emerald-500/20 rounded-full transition-colors duration-200"
                                >
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={handleCreateSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Scheme Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter scheme name"
                                        className="w-full px-4 py-3 border border-emerald-500/30 rounded-xl focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-400 transition-all duration-200 bg-slate-800/50 backdrop-blur-sm text-white placeholder-gray-400"
                                        value={newScheme.name}
                                        onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                                    <textarea
                                        placeholder="Enter scheme description"
                                        rows={3}
                                        className="w-full px-4 py-3 border border-emerald-500/30 rounded-xl focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-400 transition-all duration-200 resize-none bg-slate-800/50 backdrop-blur-sm text-white placeholder-gray-400"
                                        value={newScheme.description}
                                        onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Link</label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com"
                                        className="w-full px-4 py-3 border border-emerald-500/30 rounded-xl focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-400 transition-all duration-200 bg-slate-800/50 backdrop-blur-sm text-white placeholder-gray-400"
                                        value={newScheme.link}
                                        onChange={(e) => setNewScheme({ ...newScheme, link: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
                                    <select
                                        className="w-full px-4 py-3 border border-emerald-500/30 rounded-xl focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-400 transition-all duration-200 bg-slate-800/50 backdrop-blur-sm text-white"
                                        value={newScheme.category}
                                        onChange={(e) => setNewScheme({ ...newScheme, category: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        className="flex-1 px-4 py-3 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/10 transition-all duration-200 font-medium text-gray-300"
                                        onClick={closeCreateModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 border border-emerald-400/20"
                                    >
                                        Create Scheme
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {editingScheme && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-slate-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-emerald-500/20">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                                    Edit Scheme
                                </h2>
                                <button
                                    onClick={closeEditModal}
                                    className="p-2 hover:bg-emerald-500/20 rounded-full transition-colors duration-200"
                                >
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Scheme Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter scheme name"
                                        className="w-full px-4 py-3 border border-emerald-500/30 rounded-xl focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-400 transition-all duration-200 bg-slate-800/50 backdrop-blur-sm text-white placeholder-gray-400"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                                    <textarea
                                        placeholder="Enter scheme description"
                                        rows={3}
                                        className="w-full px-4 py-3 border border-emerald-500/30 rounded-xl focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-400 transition-all duration-200 resize-none bg-slate-800/50 backdrop-blur-sm text-white placeholder-gray-400"
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Link</label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com"
                                        className="w-full px-4 py-3 border border-emerald-500/30 rounded-xl focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-400 transition-all duration-200 bg-slate-800/50 backdrop-blur-sm text-white placeholder-gray-400"
                                        value={editForm.link}
                                        onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
                                    <select
                                        className="w-full px-4 py-3 border border-emerald-500/30 rounded-xl focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-400 transition-all duration-200 bg-slate-800/50 backdrop-blur-sm text-white"
                                        value={editForm.category}
                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        className="flex-1 px-4 py-3 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/10 transition-all duration-200 font-medium text-gray-300"
                                        onClick={closeEditModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 border border-emerald-400/20"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Schemes
