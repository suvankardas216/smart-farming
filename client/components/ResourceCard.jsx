const ResourceCard = ({ resource }) => {
    const getTypeIcon = (type) => {
        switch (type) {
            case "article":
                return "📄"
            case "guide":
                return "📚"
            case "video":
                return "🎥"
            default:
                return "📋"
        }
    }

    const getTypeColor = (type) => {
        switch (type) {
            case "article":
                return "from-green-400 to-green-600"
            case "guide":
                return "from-blue-400 to-blue-600"
            case "video":
                return "from-purple-400 to-purple-600"
            default:
                return "from-gray-400 to-gray-600"
        }
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
            <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 flex-1 pr-2">
                    {resource.title}
                </h2>
                <div
                    className={`bg-gradient-to-r ${getTypeColor(resource.type)} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shrink-0`}
                >
                    <span>{getTypeIcon(resource.type)}</span>
                    {resource.type}
                </div>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">{resource.description}</p>

            {resource.contentUrl && (
                <a
                    href={resource.contentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors duration-200 group/link"
                >
                    <svg
                        className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                    </svg>
                    View Content
                </a>
            )}

            {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, idx) => (
                        <span
                            key={idx}
                            className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-blue-200 text-gray-700 hover:text-blue-700 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-default"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ResourceCard
