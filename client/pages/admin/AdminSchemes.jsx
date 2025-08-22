import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";

const categories = [
    "Employment & Rural Development",
    "Livestock & Dairy",
    "Allied Agriculture",
    "Infrastructure Development",
    "Fisheries & Aquaculture",
    "Environmental & Climate",
    "Energy & Technology",
    "Organic & Sustainable Farming",
    "Crop Production & Development",
];

const AdminSchemes = () => {
    const [schemes, setSchemes] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    // Add form state
    const [newScheme, setNewScheme] = useState({
        name: "",
        description: "",
        link: "",
        category: "",
    });

    // Edit form state
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({
        name: "",
        description: "",
        link: "",
        category: "",
    });

    const hasAddErrors = useMemo(() => {
        if (!newScheme.name.trim()) return "Name is required";
        if (!newScheme.description.trim()) return "Description is required";
        try {
            new URL(newScheme.link);
        } catch {
            return "A valid link is required";
        }
        if (!newScheme.category) return "Category is required";
        return "";
    }, [newScheme]);

    const fetchSchemes = async (pageNumber = 1) => {
        try {
            setIsLoading(true);
            setErrMsg("");
            const { data } = await axiosInstance.get(`/schemes?page=${pageNumber}`);
            setSchemes(Array.isArray(data?.results) ? data.results : []);
            if (typeof data?.page === "number" && data.page !== pageNumber) {
                setPage(data.page);
            }
            setTotalPages(data?.totalPages ?? 1);
        } catch (err) {
            setErrMsg(err?.response?.data?.message || "Failed to load schemes.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSchemes(page);
    }, [page]);

    const handleAddScheme = async (e) => {
        e.preventDefault();
        if (hasAddErrors) return;
        try {
            setIsLoading(true);
            setErrMsg("");
            await axiosInstance.post("/schemes", newScheme);
            setNewScheme({ name: "", description: "", link: "", category: "" });
            await fetchSchemes(page);
        } catch (err) {
            setErrMsg(err?.response?.data?.message || "Failed to add scheme.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this scheme?")) return;
        try {
            setIsLoading(true);
            setErrMsg("");
            await axiosInstance.delete(`/schemes/${id}`);

            if (schemes.length === 1 && page > 1) {
                setPage((p) => p - 1);
            } else {
                await fetchSchemes(page);
            }
        } catch (err) {
            setErrMsg(err?.response?.data?.message || "Failed to delete scheme.");
        } finally {
            setIsLoading(false);
        }
    };

    const openEdit = (scheme) => {
        setEditingId(scheme._id);
        setEditData({
            name: scheme.name || "",
            description: scheme.description || "",
            link: scheme.link || "",
            category: scheme.category || "",
        });
        setTimeout(() => {
            document.getElementById("edit-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData({ name: "", description: "", link: "", category: "" });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!editingId) return;

        const original = schemes.find((s) => s._id === editingId);
        if (!original) return;

        const updatedData = {};
        if (editData.name.trim() && editData.name.trim() !== original.name) {
            updatedData.name = editData.name.trim();
        }
        if (editData.description.trim() && editData.description.trim() !== original.description) {
            updatedData.description = editData.description.trim();
        }
        if (editData.link.trim() && editData.link.trim() !== original.link) {
            updatedData.link = editData.link.trim();
        }
        if ((editData.category || "") !== (original.category || "")) {
            updatedData.category = editData.category || "";
        }

        if (Object.keys(updatedData).length === 0) {
            cancelEdit();
            return;
        }

        try {
            setIsLoading(true);
            setErrMsg("");
            await axiosInstance.put(`/schemes/${editingId}`, updatedData);
            await fetchSchemes(page);
            cancelEdit();
        } catch (err) {
            setErrMsg(err?.response?.data?.message || "Failed to update scheme.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
            <Link
                to="/admin"
                className="inline-flex mb-3 items-center px-3 py-1.5 text-sm font-medium text-black bg-white rounded-md shadow hover:bg-gray-100 transition"
            >
                ← Back
            </Link>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">Government Schemes Management</h1>
                    <p className="text-slate-600">Manage and organize government schemes efficiently</p>
                </div>

                {/* Error Message */}
                {errMsg && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-red-100 p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-red-700 font-medium">{errMsg}</span>
                        </div>
                    </div>
                )}

                {/* Add Scheme Form */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Scheme
                            </h2>
                            {isLoading && (
                                <div className="flex items-center gap-2 text-emerald-100">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm">Processing...</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleAddScheme} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Scheme Name *</label>
                                <input
                                    type="text"
                                    placeholder="Enter scheme name"
                                    value={newScheme.name}
                                    onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Category *</label>
                                <select
                                    value={newScheme.category}
                                    onChange={(e) => setNewScheme({ ...newScheme, category: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Link *</label>
                                <input
                                    type="url"
                                    placeholder="https://example.com"
                                    value={newScheme.link}
                                    onChange={(e) => setNewScheme({ ...newScheme, link: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Description *</label>
                                <textarea
                                    placeholder="Enter scheme description"
                                    value={newScheme.description}
                                    onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 h-24 resize-none"
                                    required
                                />
                            </div>
                        </div>

                        {hasAddErrors && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {hasAddErrors}
                                </p>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                disabled={!!hasAddErrors || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Scheme
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Edit Scheme Form */}
                {editingId && (
                    <div id="edit-form" className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 mb-8 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Scheme
                                </h2>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors duration-200"
                                        onClick={cancelEdit}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Scheme Name</label>
                                    <input
                                        type="text"
                                        placeholder="Scheme Name"
                                        value={editData.name}
                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Category</label>
                                    <select
                                        value={editData.category}
                                        onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700">Link</label>
                                    <input
                                        type="url"
                                        placeholder="Link"
                                        value={editData.link}
                                        onChange={(e) => setEditData({ ...editData, link: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700">Description</label>
                                    <textarea
                                        placeholder="Description"
                                        value={editData.description}
                                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-24 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Schemes Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            All Schemes
                        </h2>
                        <div className="text-sm text-slate-300">
                            {schemes.length} scheme{schemes.length !== 1 ? "s" : ""} found
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-3 text-slate-600">Loading schemes...</span>
                        </div>
                    ) : schemes.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No schemes found</h3>
                            <p className="text-slate-500">Get started by adding your first scheme above.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Description</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Category</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Link</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {schemes.map((scheme, index) => (
                                        <tr
                                            key={scheme._id}
                                            className={`hover:bg-slate-50 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-slate-25"}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{scheme.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-600 max-w-xs truncate" title={scheme.description}>
                                                    {scheme.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {scheme.category ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                        {scheme.category}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <a
                                                    href={scheme.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-150"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    View
                                                </a>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openEdit(scheme)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-150"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Update
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(scheme._id)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-150"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-600">
                                    Page {page} of {totalPages}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={page === 1 || isLoading}
                                        className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={page === totalPages || isLoading}
                                        className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                                    >
                                        Next
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSchemes;