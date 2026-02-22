import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import { IconShoppingCart } from "@tabler/icons-react";
import axios from "axios";
import { IMAGE_BASE_URL } from "../lib/constants";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch
        setTimeout(() => {
            setProduct({
                id: id,
                title: "iPhone 15 Pro",
                description: "Apple's latest flagship with A17 Pro chip. Titanium design.",
                price: 999.00,
                category: "Phones",
                imageUrl: null
            });
            setLoading(false);
        }, 500);
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading product...</div>;
    if (!product) return <div className="p-8 text-center">Product not found.</div>;

    return (
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="bg-gray-100 dark:bg-gray-700 h-96 md:h-full flex items-center justify-center">
                    <img
                        src={product.imageUrl ? `${IMAGE_BASE_URL}/uploads/${product.imageUrl}` : "https://via.placeholder.com/600"}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain"
                    />
                </div>
                <div className="p-8 space-y-6">
                    <div>
                        <span className="text-primary-600 font-bold tracking-wide uppercase text-sm">{product.category}</span>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">{product.title}</h1>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{product.description}</p>

                    <div className="flex items-center justify-between py-4 border-y border-gray-100 dark:border-gray-700">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <Button className="flex-1 py-4 text-lg flex justify-center items-center shadow-xl shadow-primary-500/20">
                            <IconShoppingCart size={24} className="mr-2" /> Add to Cart
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
