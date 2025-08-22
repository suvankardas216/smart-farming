"use client"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import axiosInstance from "../../utils/axiosInstance"
import { Link } from "react-router-dom"

const AdminResources = () => {
    const [resources, setResources] = useState([])
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "",
        contentUrl: "",
        tags: "",
    })
    const [editingId, setEditingId] = useState(null)

    // Fetch resources
    const fetchResources = async () => {
        try {
            const response = await axiosInstance.get("/resources")
            setResources(response.data)
        } catch (err) {
            console.error(err)
            toast.error("Failed to fetch resources")
        }
    }

    useEffect(() => {
        fetchResources()
    }, [])

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Add or Update Resource
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(",").map((t) => t.trim()),
            }

            if (editingId) {
                // Update existing resource
                await axiosInstance.put(`/resources/${editingId}`, payload)
                toast.success("Resource updated successfully!")
                setEditingId(null)
            } else {
                // Add new resource
                await axiosInstance.post("/resources", payload)
                toast.success("Resource added successfully!")
            }

            setFormData({
                title: "",
                description: "",
                type: "",
                contentUrl: "",
                tags: "",
            })
            fetchResources() // Refresh the list
        } catch (err) {
            console.error(err)
            toast.error("Something went wrong!")
        }
    }

    // Delete Resource
    const handleDelete = async (id) => {
        if (!window.confirm("⚠️ Are you sure you want to delete this resource?")) return
        try {
            await axiosInstance.delete(`/resources/${id}`)
            toast.success("Resource deleted successfully!")
            fetchResources() // Refresh the list
        } catch (err) {
            console.error(err)
            toast.error("Failed to delete resource!")
        }
    }

    // Load resource into form for editing
    const handleEdit = (resource) => {
        setFormData({
            title: resource.title,
            description: resource.description,
            type: resource.type,
            contentUrl: resource.contentUrl,
            tags: resource.tags.join(", "),
        })
        setEditingId(resource._id)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">

            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold">Manage Resources</h1>

                </div>

            </div>

            <div className="p-6">
                <Link
                    to="/admin"
                    className="inline-flex mb-3 items-center px-3 py-1.5 text-sm font-medium text-black bg-white rounded-md shadow hover:bg-gray-100 transition"
                >
                    ← Back
                </Link>
                <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-6 mb-8 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        {editingId ? "Update Resource" : "Add New Resource"}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter resource title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="video">📹 Video</option>
                                <option value="guide">📖 Guide</option>
                                <option value="article">📄 Article</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            placeholder="Enter resource description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content URL</label>
                            <input
                                type="url"
                                name="contentUrl"
                                placeholder="https://example.com/resource"
                                value={formData.contentUrl}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                            <input
                                type="text"
                                name="tags"
                                placeholder="farming, organic, guide (comma separated)"
                                value={formData.tags}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {editingId ? "Update Resource" : "Add Resource"}
                    </button>
                </form>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                            </svg>
                            Resources ({resources.length})
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <div className="min-w-full">
                            {resources.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg
                                        className="w-16 h-16 text-gray-300 mx-auto mb-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                        />
                                    </svg>
                                    <p className="text-gray-500 text-lg">No resources found</p>
                                    <p className="text-gray-400">Add your first resource using the form above</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {resources.map((resource, index) => (
                                        <div
                                            key={resource._id}
                                            className={`p-6 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                                        >
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="flex-shrink-0">
                                                            {resource.type === "video" && (
                                                                <div className="bg-red-100 text-red-600 p-2 rounded-lg">
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                            {resource.type === "guide" && (
                                                                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                            {resource.type === "article" && (
                                                                <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="text-lg font-semibold text-gray-900 truncate">{resource.title}</h3>
                                                            <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2 mt-3">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${resource.type === "video"
                                                                ? "bg-red-100 text-red-700"
                                                                : resource.type === "guide"
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : "bg-green-100 text-green-700"
                                                                }`}
                                                        >
                                                            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                                                        </span>
                                                        {resource.tags.map((tag, tagIndex) => (
                                                            <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <a
                                                        href={resource.contentUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mt-2 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                            />
                                                        </svg>
                                                        View Resource
                                                    </a>
                                                </div>

                                                <div className="flex gap-2 flex-shrink-0">
                                                    <button
                                                        onClick={() => handleEdit(resource)}
                                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm font-medium"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                            />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(resource._id)}
                                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm font-medium"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminResources
