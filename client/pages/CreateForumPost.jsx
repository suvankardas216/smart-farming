"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import axiosInstance from "../utils/axiosInstance"

const CreateForumPost = () => {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [tags, setTags] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    if (!user) {
        return (
            <div className="h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 overflow-auto">
                <main className="flex items-center justify-center min-h-full px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-red-100">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Authentication Required</h2>
                        <p className="text-red-600 font-medium">You must be logged in to create a post.</p>
                    </div>
                </main>
            </div>
        )
    }

    const handleBack = () => {
        navigate("/forum") // ✅ Go back to forum without posting
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) {
            setError("Title and content are required.")
            return
        }

        setLoading(true)
        try {
            const res = await axiosInstance.post("/forum", {
                title,
                content,
                tags: tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
            })
            navigate(`/forum/${res.data._id}`) // Redirect to newly created post
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || "Failed to create post")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 overflow-auto">
            <main className="py-8 px-4 max-w-4xl mx-auto">
                <button
                    onClick={handleBack}
                    className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-200 hover:shadow-md font-medium"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Forum
                </button>

                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                            Create New Forum Post
                        </h2>
                        <p className="text-gray-600">Share your thoughts and engage with the community</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Post Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                placeholder="Enter an engaging title for your post..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-xl h-48 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
                                placeholder="Share your thoughts, ask questions, or start a discussion..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                placeholder="e.g., crops, irrigation, farming tips"
                            />
                            <p className="text-sm text-gray-500 mt-1">Separate tags with commas to help others find your post</p>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-blue-600 focus:ring-4 focus:ring-emerald-200 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Posting...
                                    </div>
                                ) : (
                                    "Publish Post"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default CreateForumPost
