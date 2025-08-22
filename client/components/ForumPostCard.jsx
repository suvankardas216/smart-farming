import { Link } from "react-router-dom"

const ForumPostCard = ({ post }) => {
    if (!post || !post._id) return null

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-emerald-200 group">
            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors duration-200 line-clamp-2">
                {post.title || "No Title"}
            </h3>

            <p className="text-gray-600 mb-4 leading-relaxed">
                {post.content ? post.content.substring(0, 150) : "No content available"}
                {post.content && post.content.length > 150 && "..."}
            </p>

            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 px-3 py-1 bg-emerald-50 rounded-full">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-emerald-700 font-medium text-sm">{post.upvotes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-red-50 rounded-full">
                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-red-700 font-medium text-sm">{post.downvotes?.length || 0}</span>
                </div>
            </div>

            <Link
                to={`/forum/${post._id}`}
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200 group/link"
            >
                Read Full Post
                <svg
                    className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </Link>
        </div>
    )
}

export default ForumPostCard
