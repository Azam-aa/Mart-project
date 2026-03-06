import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useCart } from "../../context/CartContext";

const BACKEND = "http://localhost:8080";

const ProductGrid = ({ selectedCategory = "All" }) => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 12;

    // Reset to page 0 when category changes
    useEffect(() => {
        setCurrentPage(0);
    }, [selectedCategory]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                const params = new URLSearchParams({ page: currentPage, size: pageSize });
                if (selectedCategory !== "All") params.append("category", selectedCategory);

                const url = `${BACKEND}/api/products?${params.toString()}`;
                console.log("[ProductGrid] Fetching:", url);

                const response = await fetch(url, {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const data = await response.json();
                console.log("[ProductGrid] Response:", data);
                
                const parsedTotalPages = data.page?.totalPages ?? data.totalPages ?? 1;
                const parsedTotalElements = data.page?.totalElements ?? data.totalElements ?? 0;
                
                console.log("[ProductGrid] totalPages:", parsedTotalPages, "| totalElements:", parsedTotalElements);

                setProducts(data.content || []);
                setTotalPages(parsedTotalPages);
                setTotalElements(parsedTotalElements);
            } catch (err) {
                console.error("[ProductGrid] Fetch failed:", err.message);
                setError(`Could not load products: ${err.message}`);
                setProducts([]);
                setTotalPages(1);
                setTotalElements(0);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory, currentPage]);

    const goToPage = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600" />
        </div>
    );

    if (error) return (
        <div className="text-center py-16">
            <p className="text-red-500 font-semibold">{error}</p>
            <p className="text-gray-400 text-sm mt-2">Make sure the backend is running on port 8080.</p>
        </div>
    );

    if (products.length === 0) return (
        <div className="text-center py-20 text-gray-500 font-medium">
            No products found in this category.
        </div>
    );

    return (
        <div>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col items-center gap-4 mt-8 pb-6">

                {/* Info */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Page{" "}
                    <span className="font-bold text-gray-800 dark:text-white">{currentPage + 1}</span>
                    {" "}of{" "}
                    <span className="font-bold text-gray-800 dark:text-white">{totalPages}</span>
                    {totalElements > 0 && (
                        <span className="ml-2 text-violet-500 font-semibold">· {totalElements} products</span>
                    )}
                </p>

                {/* Buttons */}
                <div className="flex items-center gap-2">

                    {/* Previous */}
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 0}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${currentPage === 0
                                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                : "bg-white dark:bg-gray-800 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-gray-600 hover:bg-violet-50 hover:border-violet-400 shadow-sm"
                            }`}
                    >
                        ← Prev
                    </button>

                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => goToPage(idx)}
                            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 ${currentPage === idx
                                    ? "bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900 scale-110"
                                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700"
                                }`}
                        >
                            {idx + 1}
                        </button>
                    ))}

                    {/* Next */}
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${currentPage >= totalPages - 1
                                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                : "bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-200 dark:shadow-violet-900"
                            }`}
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductGrid;
