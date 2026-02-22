import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, IMAGE_BASE_URL } from "../lib/constants";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { IconPlus, IconEdit, IconTrash, IconPackage, IconCurrencyDollar, IconCategory } from "@tabler/icons-react";

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "Mobiles",
        stock: "",
        image: null
    });

    const categories = ["Mobiles", "Laptops", "Appliances", "Headphones", "Watches"];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // Products API is paginated — use .content and a large size to get all for admin view
            const response = await axios.get(`${API_BASE_URL}/products?size=1000`);
            const data = response.data;
            setProducts(Array.isArray(data) ? data : (data.content ?? []));
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            price: "",
            category: "Mobiles",
            stock: "",
            image: null
        });
        setIsEditing(false);
        setCurrentProductId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("category", formData.category);
        data.append("stock", formData.stock);
        if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            if (isEditing) {
                await axios.put(`${API_BASE_URL}/products/${currentProductId}`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                alert("Product updated successfully!");
            } else {
                await axios.post(`${API_BASE_URL}/products`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                alert("Product added successfully!");
            }
            fetchProducts();
            resetForm();
        } catch (error) {
            console.error("Operation failed", error);
            alert("Error: " + (error.response?.data?.message || "Something went wrong"));
        }
    };

    const handleEdit = (product) => {
        setFormData({
            title: product.title,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            image: null // Don't pre-fill image for security/logic reasons
        });
        setIsEditing(true);
        setCurrentProductId(product.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`${API_BASE_URL}/products/${id}`);
                fetchProducts();
                alert("Product deleted!");
            } catch (error) {
                console.error("Delete failed", error);
                alert("Failed to delete product");
            }
        }
    };

    // Calculate Stats
    const totalValue = products.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);
    const lowStockCount = products.filter(p => p.stock < 10).length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-20">
            {/* Header / Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="text-gray-500 font-medium mb-1">Total Products</div>
                        <div className="text-4xl font-black text-gray-900 dark:text-white">{products.length}</div>
                    </div>
                    <div className="absolute right-4 top-4 text-violet-100 dark:text-violet-900/20 transform group-hover:scale-110 transition-transform">
                        <IconPackage size={64} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="text-gray-500 font-medium mb-1">Inventory Value</div>
                        <div className="text-4xl font-black text-gray-900 dark:text-white">₹{totalValue.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="absolute right-4 top-4 text-green-100 dark:text-green-900/20 transform group-hover:scale-110 transition-transform">
                        <IconCurrencyDollar size={64} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="text-gray-500 font-medium mb-1">Low Stock Alerts</div>
                        <div className={`text-4xl font-black ${lowStockCount > 0 ? 'text-red-500' : 'text-green-500'}`}>{lowStockCount}</div>
                    </div>
                    <div className="absolute right-4 top-4 text-red-100 dark:text-red-900/20 transform group-hover:scale-110 transition-transform">
                        <IconCategory size={64} />
                    </div>
                </div>
            </div>

            {/* Add/Edit Form Section */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-100/50 dark:bg-violet-900/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                <div className="flex justify-between items-center mb-8 relative">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${isEditing ? 'bg-amber-100 text-amber-600' : 'bg-violet-100 text-violet-600'}`}>
                            {isEditing ? <IconEdit size={24} /> : <IconPlus size={24} />}
                        </span>
                        {isEditing ? "Edit Product Details" : "Add New Product"}
                    </h2>
                    {isEditing && (
                        <button onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-800 underline">Cancel Edit</button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
                    <div className="space-y-6">
                        <Input
                            label="Product Title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g. iPhone 15 Pro Max"
                            required
                            className="text-lg font-medium"
                        />
                        <div className="grid grid-cols-2 gap-6">
                            <Input
                                label="Price (₹)"
                                type="number"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                required
                            />
                            <Input
                                label="Stock Quantity"
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                placeholder="0"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-violet-500 rounded-2xl outline-none dark:text-white transition-all appearance-none cursor-pointer"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-6 flex flex-col justify-between">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-violet-500 rounded-2xl outline-none dark:text-white transition-all resize-none"
                                placeholder="Detailed product description..."
                                required
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Product Image</label>
                            <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl p-6 hover:border-violet-500 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-all cursor-pointer text-center group">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer block w-full h-full">
                                    <span className="text-gray-400 group-hover:text-violet-600 transition-colors">
                                        {formData.image ? formData.image.name : "Click to upload image"}
                                    </span>
                                </label>
                            </div>
                        </div>

                        <Button type="submit" className="w-full py-4 rounded-2xl text-lg shadow-xl shadow-violet-500/20 bg-violet-600 hover:bg-violet-700 transform hover:-translate-y-1 transition-all">
                            {isEditing ? "Update Product" : "Create Product"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Product List Section */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/20">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Inventory Management</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-8 py-5">Product</th>
                                <th className="px-8 py-5">Category</th>
                                <th className="px-8 py-5">Price</th>
                                <th className="px-8 py-5">Stock</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-medium italic">No products found.</td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="group hover:bg-violet-50/30 dark:hover:bg-violet-900/10 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden p-1 flex-shrink-0">
                                                    {product.imageUrl && (
                                                        <img src={`${IMAGE_BASE_URL}${product.imageUrl}`} alt="" className="w-full h-full object-contain" />
                                                    )}
                                                </div>
                                                <span className="font-bold text-gray-900 dark:text-white">{product.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 font-bold text-gray-700 dark:text-gray-300">
                                            ₹{product.price.toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={`font-bold ${product.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-2 text-violet-600 hover:bg-violet-100 rounded-lg transition-colors"
                                                >
                                                    <IconEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                >
                                                    <IconTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
