"use client"

const ProductCard = ({ product, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="cursor-pointer bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group relative"
        >
            <div className="relative overflow-hidden">
                <img
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {product.stockQuantity === 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        Out of Stock
                    </div>
                )}
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {product.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4">{product.description}</p>

                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            ₹{product.price}
                        </span>
                    </div>

                    <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
                        <span className="text-yellow-600 font-semibold text-sm">
                            {product.averageRating ? product.averageRating.toFixed(1) : "New"}
                        </span>
                        <span className="text-yellow-500">⭐</span>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
    )
}

export default ProductCard
