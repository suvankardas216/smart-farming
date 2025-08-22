"use client"
import { useState, useEffect } from "react"
import { Toaster, toast } from "react-hot-toast"
import { Link } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"

const Users = () => {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [activeTab, setActiveTab] = useState("all")

    const getFilteredUsers = () => {
        if (activeTab === "all") return users
        return users.filter((user) => user.role === activeTab)
    }

    const getTabCounts = () => {
        return {
            all: users.length,
            admin: users.filter((user) => user.role === "admin").length,
            expert: users.filter((user) => user.role === "expert").length,
            farmer: users.filter((user) => user.role === "farmer").length,
        }
    }

    const getRoleBadgeStyle = (role) => {
        switch (role) {
            case "admin":
                return "bg-purple-100 text-purple-800 border-purple-200"
            case "expert":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "farmer":
                return "bg-green-100 text-green-800 border-green-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getStatusBadgeStyle = (isBanned) => {
        return isBanned ? "bg-red-100 text-red-800 border-red-200" : "bg-green-100 text-green-800 border-green-200"
    }

    const fetchUsers = async () => {
        try {
            setLoading(true)
            setError("")
            const { data } = await axiosInstance.get("/admin/users")
            setUsers(data)
            toast.success(`Loaded ${data.length} users successfully`)
        } catch (err) {
            setError("Failed to fetch users")
            toast.error("Failed to fetch users")
            console.error("Error fetching users:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleBanUnban = async (id, isBanned) => {
        try {
            await axiosInstance.put(`/admin/user/${id}/${isBanned ? "unban" : "ban"}`)
            setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isBanned: !isBanned } : u)))
            if (selectedUser && selectedUser._id === id) {
                setSelectedUser({ ...selectedUser, isBanned: !isBanned })
            }
            toast.success(`User ${isBanned ? "unbanned" : "banned"} successfully`)
        } catch (err) {
            toast.error(`Failed to ${isBanned ? "unban" : "ban"} user`)
            console.error("Error banning/unbanning user:", err)
        }
    }

    const handleDelete = async (id) => {
        const confirmDelete = () => {
            toast(
                (t) => (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>
                            <span className="font-medium">Delete User</span>
                        </div>
                        <p className="text-sm text-gray-600">
                            Are you sure you want to delete this user? This action cannot be undone.
                        </p>
                        <div className="flex gap-2 justify-end">
                            <button
                                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                                onClick={() => toast.dismiss()}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                                onClick={() => performDelete(id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ),
                {
                    duration: Number.POSITIVE_INFINITY,
                    style: {
                        maxWidth: "400px",
                    },
                },
            )
        }

        const performDelete = async (id) => {
            try {
                await axiosInstance.delete(`/user/${id}`)
                setUsers((prev) => prev.filter((u) => u._id !== id))
                if (selectedUser && selectedUser._id === id) {
                    setSelectedUser(null)
                }
                toast.success("User deleted successfully")
            } catch (err) {
                toast.error("Failed to delete user")
                console.error("Error deleting user:", err)
            }
        }

        confirmDelete()
    }

    const handleRoleChange = async (id, role) => {
        try {
            await axiosInstance.put(`/user/${id}/role`, { role })
            setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)))
            if (selectedUser && selectedUser._id === id) {
                setSelectedUser({ ...selectedUser, role })
            }
            toast.success(`Role updated to ${role} successfully`)
        } catch (err) {
            toast.error("Failed to update role")
            console.error("Error updating role:", err)
        }
    }

    const filteredUsers = getFilteredUsers()
    const tabCounts = getTabCounts()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: "#fff",
                        color: "#374151",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        border: "1px solid #e5e7eb",
                    },
                }}
            />

            <div className="max-w-7xl mx-auto space-y-8">
                <Link
                    to="/admin"
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-black bg-white rounded-md shadow hover:bg-gray-100 transition"
                >
                    ← Back
                </Link>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                User Management
                            </h1>
                            <p className="text-slate-600 mt-1">Manage users, roles, and permissions</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="border-b border-slate-200">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab("all")}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === "all"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                                    }`}
                            >
                                All Users ({tabCounts.all})
                            </button>
                            <button
                                onClick={() => setActiveTab("admin")}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === "admin"
                                        ? "border-purple-500 text-purple-600"
                                        : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                                    }`}
                            >
                                Admin ({tabCounts.admin})
                            </button>
                            <button
                                onClick={() => setActiveTab("expert")}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === "expert"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                                    }`}
                            >
                                Expert ({tabCounts.expert})
                            </button>
                            <button
                                onClick={() => setActiveTab("farmer")}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === "farmer"
                                        ? "border-green-500 text-green-600"
                                        : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                                    }`}
                            >
                                Farmer ({tabCounts.farmer})
                            </button>
                        </nav>
                    </div>
                </div>

                {loading && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="text-slate-600 font-medium">Loading users...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <p className="text-red-800 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {!loading && filteredUsers.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <h2 className="text-lg font-semibold text-slate-800">
                                {activeTab === "all" ? "All Users" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + " Users"}{" "}
                                ({filteredUsers.length})
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                                    <tr>
                                        <th className="p-4 text-left font-semibold min-w-[200px]">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                                Name
                                            </div>
                                        </th>
                                        <th className="p-4 text-left font-semibold min-w-[250px]">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                Email
                                            </div>
                                        </th>
                                        <th className="p-4 text-left font-semibold min-w-[120px]">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                    />
                                                </svg>
                                                Role
                                            </div>
                                        </th>
                                        <th className="p-4 text-left font-semibold min-w-[120px]">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                Status
                                            </div>
                                        </th>
                                        <th className="p-4 text-left font-semibold min-w-[200px]">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 5v.01M12 12v.01M12 19v.01M12 22v-4a4 4 0 014-4m4 0H8a4 4 0 01-4 4v4z"
                                                    />
                                                </svg>
                                                Actions
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {filteredUsers.map((user, index) => (
                                        <tr
                                            key={user._id}
                                            className={`hover:bg-slate-50 cursor-pointer transition-all duration-200 ${selectedUser?._id === user._id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                                                }`}
                                            onClick={() => setSelectedUser(user)}
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800 whitespace-nowrap">{user.name}</p>
                                                        <p className="text-sm text-slate-500 whitespace-nowrap">ID: {user._id.slice(-6)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-slate-700 whitespace-nowrap">{user.email}</p>
                                            </td>
                                            <td className="p-4">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getRoleBadgeStyle(user.role)}`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusBadgeStyle(user.isBanned)}`}
                                                >
                                                    {user.isBanned ? "Banned" : "Active"}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleBanUnban(user._id, user.isBanned)
                                                        }}
                                                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${user.isBanned
                                                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                                : "bg-red-100 text-red-700 hover:bg-red-200"
                                                            }`}
                                                    >
                                                        {user.isBanned ? "Unban" : "Ban"}
                                                    </button>
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => {
                                                            e.stopPropagation()
                                                            handleRoleChange(user._id, e.target.value)
                                                        }}
                                                        className="px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="farmer">Farmer</option>
                                                        <option value="expert">Expert</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleDelete(user._id)
                                                        }}
                                                        className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {!loading && filteredUsers.length === 0 && !error && users.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                No {activeTab === "all" ? "" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Users Found
                            </h3>
                            <p className="text-slate-600">
                                There are no {activeTab === "all" ? "" : activeTab} users to display at the moment.
                            </p>
                        </div>
                    </div>
                )}

                {!loading && users.length === 0 && !error && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Users Found</h3>
                            <p className="text-slate-600">There are no users to display at the moment.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Users
