"use client"
import { useState, useEffect } from "react"
import ResourceFilter from "../components/ResourceFilter"
import ResourceCard from "../components/ResourceCard"
import axiosInstance from "../utils/axiosInstance"

const ResourcesPage = () => {
    const [resources, setResources] = useState([])
    const [filteredResources, setFilteredResources] = useState([])
    const [loading, setLoading] = useState(true) // Added loading state

    useEffect(() => {
        // Fetch resources from backend
        const fetchResources = async () => {
            try {
                const res = await axiosInstance.get("/resources")
                setResources(res.data)
                setFilteredResources(res.data) // initially show all
            } catch (err) {
                console.error("Error fetching resources:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchResources()
    }, [])

    // Filtering logic
    const handleFilter = ({ type, tag }) => {
        let filtered = resources

        if (type) {
            filtered = filtered.filter((r) => r.type === type)
        }

        if (tag) {
            filtered = filtered.filter((r) => r.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())))
        }

        setFilteredResources(filtered)
    }

    return (
        <div className="h-screen bg-gradient-to-br mt-15 from-gray-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        Learning Resources
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Discover articles, guides, and videos to enhance your knowledge and skills
                    </p>
                </div>

                {/* Filter UI */}
                <ResourceFilter onFilter={handleFilter} />

                {/* Resource List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <p>Loading resources...</p>
                    ) : filteredResources.length > 0 ? (
                        filteredResources.map((resource) => <ResourceCard key={resource._id} resource={resource} />)
                    ) : (
                        <div className="col-span-full text-center py-16">
                            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">No resources found</h3>
                                <p className="text-gray-600">Try adjusting your filters to find more resources.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ResourcesPage
