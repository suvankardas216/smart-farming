"use client"

import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axiosInstance from "../utils/axiosInstance"
import { AuthContext } from "../context/AuthContext"

const ForumPostDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)

    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axiosInstance.get(`/forum/${id}`)
                setPost(res.data.post)
                setComments(res.data.comments || [])
            } catch (err) {
                console.error(err)
                setError(err.response?.data?.message || "Failed to fetch post")
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchPost()
    }, [id])

    const handleBack = () => navigate("/forum")

    const handleUpvote = async () => {
        try {
            const res = await axiosInstance.put(`/forum/${id}/upvote`)
            setPost(res.data)
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || "Failed to upvote")
        }
    }

    const handleDownvote = async () => {
        try {
            const res = await axiosInstance.put(`/forum/${id}/downvote`)
            setPost(res.data)
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || "Failed to downvote")
        }
    }

    const handleAddComment = async () => {
        if (!commentText.trim()) return
        try {
            const res = await axiosInstance.post(`/forum/${id}/comment`, {
                content: commentText,
            })
            setComments((prev) => [...prev, res.data])
            setCommentText("")
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || "Failed to post comment")
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

                {loading && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading post...</p>
                    </div>
                )}

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

                {post && (
                    <>
                        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">{post.title}</h2>
                            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-6">
                                <p>{post.content}</p>
                            </div>

                            <div className="flex gap-3 mb-6 pt-4 border-t border-gray-100">
                                <button
                                    onClick={handleUpvote}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 11-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Upvote ({post.upvotes?.length || 0})
                                </button>
                                <button
                                    onClick={handleDownvote}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Downvote ({post.downvotes?.length || 0})
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">Comments</h3>
                            </div>

                            {user && (
                                <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            placeholder="Share your thoughts on this post..."
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                        />
                                        <button
                                            onClick={handleAddComment}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                                        >
                                            Post
                                        </button>
                                    </div>
                                </div>
                            )}

                            {comments.length === 0 && (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 font-medium">No comments yet.</p>
                                    <p className="text-gray-400 text-sm mt-1">Be the first to share your thoughts!</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div
                                        key={comment._id}
                                        className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors duration-200"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full flex items-center justify-center">
                                                <span className="text-white font-semibold text-sm">
                                                    {(comment.author?.name || "Anonymous").charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="font-semibold text-pink-800">{comment.author ?.name || "Anonymous" }</p>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed ml-11">{comment.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}

export default ForumPostDetails
