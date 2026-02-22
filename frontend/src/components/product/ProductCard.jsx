import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IconShoppingCart, IconCheck } from "@tabler/icons-react";
import Button from "../ui/Button";
import { IMAGE_BASE_URL } from "../../lib/constants";

const ProductCard = ({ product, onAddToCart }) => {
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = () => {
        onAddToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full p-2">
            {/* Image Container with padding for clarity */}
            <div className="relative h-64 overflow-hidden bg-white dark:bg-gray-900 rounded-2xl p-4 flex items-center justify-center">
                <img
                    src={product.imageUrl ? `${IMAGE_BASE_URL}${product.imageUrl}` : "https://via.placeholder.com/300"}
                    alt={product.title}
                    className="max-w-full max-h-full object-contain transition-all duration-700 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/80 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border border-gray-100 dark:border-gray-800">
                    {product.category}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <Link to={`/product/${product.id}`} className="block group/title">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover/title:text-violet-600 transition-colors">
                        {product.title}
                    </h3>
                </Link>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2 font-medium flex-grow">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-50 dark:border-gray-700/50">
                    <div className="flex flex-col">
                        <span className="text-base font-bold text-violet-600 dark:text-violet-400">
                            ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Incl. all taxes</span>
                    </div>

                    <button
                        onClick={handleAdd}
                        className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all duration-300 transform active:scale-95 ${isAdded
                            ? 'bg-green-500 text-white'
                            : 'bg-violet-600 text-white hover:bg-violet-700'
                            }`}
                    >
                        {isAdded ? (
                            <>
                                <IconCheck size={18} stroke={3} /> Added
                            </>
                        ) : (
                            <>
                                <IconShoppingCart size={18} /> Add to Cart
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
