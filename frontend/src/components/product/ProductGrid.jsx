import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../lib/constants";
import ProductCard from "./ProductCard";
import { useCart } from "../../context/CartContext";

const ProductGrid = ({ selectedCategory = "All" }) => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 12;

    useEffect(() => {
        // Reset to page 0 when category changes
        setCurrentPage(0);
    }, [selectedCategory]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Determine API URL based on category
                // Backend expects param 'category' for filter, 'page' and 'size' for pagination
                const url = `${API_BASE_URL}/products`;
                const params = {
                    page: currentPage,
                    size: pageSize,
                    category: selectedCategory !== "All" ? selectedCategory : undefined
                };

                const response = await axios.get(url, { params });

                // Backend returns Page<Product> which maps to { content: [], totalPages: ... }
                console.log("[ProductGrid] API response:", response.data);
                const content = response.data?.content || [];
                const pages = response.data?.totalPages ?? 1;
                setProducts(content);
                setTotalPages(pages);
            } catch (err) {
                console.error("Failed to fetch products", err);
                // Fallback demo data if backend fails
                setProducts([
                    { id: 1, title: "iPhone 15 Pro", description: "Apple's latest flagship with A17 Pro chip.", price: 129000.00, category: "Mobiles", imageUrl: null },
                    { id: 2, title: "Samsung Galaxy S24", description: "AI-powered smartphone for the future.", price: 79000.00, category: "Mobiles", imageUrl: null },
                    { id: 3, title: "Sony WH-1000XM5", description: "Noise cancelling headphones.", price: 29000.00, category: "Audio", imageUrl: null },
                    { id: 4, title: "MacBook Air M3", description: "Supercharged by M3 chip.", price: 114000.00, category: "Laptops", imageUrl: null },
                ]);
                setTotalPages(1);
                setError("Using demo data (Backend might be offline or error)");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory, currentPage]);

    const handleAddToCart = (product) => {
        addToCart(product);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div>
            {error && (
                <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200 p-4 mb-6 rounded shadow-sm" role="alert">
                    <p className="font-bold">Notice</p>
                    <p>{error}</p>
                </div>
            )}

            {products.length === 0 ? (
                <div className="text-center py-20 text-gray-500 font-medium">
                    No products found in this category.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {products.length > 0 && (
                        <div className="flex justify-center items-center space-x-2 mt-8">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === 0
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                                    }`}
                            >
                                Previous
                            </button>

                            <div className="flex items-center space-x-1">
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(index)}
                                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === index
                                            ? "bg-violet-600 text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages - 1}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === totalPages - 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductGrid;
