import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProductGrid from "../components/product/ProductGrid";
import {
  IconLayoutGrid,
  IconDeviceMobile,
  IconDeviceLaptop,
  IconDeviceTv,
  IconHeadphones,
  IconDeviceWatch
} from "@tabler/icons-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { name: "All", icon: <IconLayoutGrid size={24} /> },
    { name: "Mobiles", icon: <IconDeviceMobile size={24} /> },
    { name: "Laptops", icon: <IconDeviceLaptop size={24} /> },
    { name: "Appliances", icon: <IconDeviceTv size={24} /> },
    { name: "Headphones", icon: <IconHeadphones size={24} /> },
    { name: "Watches", icon: <IconDeviceWatch size={24} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Centered Welcome Banner */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-800 text-white p-12 rounded-3xl shadow-2xl relative overflow-hidden group text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-5xl font-black mb-3 tracking-tight">
            Welcome, <span className="text-violet-200">{user?.username || 'Guest'}</span>
          </h1>
          <p className="text-xl opacity-90 font-medium tracking-wide max-w-2xl mx-auto">
            Explore our latest collection curated just for you.
          </p>
        </div>
      </div>

      {/* Category Selector */}
      <div className="space-y-6">

        <div className="flex items-center justify-center gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className="flex flex-col items-center gap-3 group outline-none"
            >
              <div className={`w-16 h-16 aspect-square rounded-full flex items-center justify-center transition-all duration-300 transform group-active:scale-90 ${selectedCategory === category.name
                ? 'bg-violet-600 text-white scale-110'
                : 'bg-white dark:bg-gray-800 text-gray-400 border border-gray-100 dark:border-gray-700 hover:border-violet-300 hover:text-violet-500'
                }`}>
                {category.icon}
              </div>
              <span className={`text-sm font-bold transition-colors ${selectedCategory === category.name
                ? 'text-violet-600'
                : 'text-gray-500 dark:text-gray-400 group-hover:text-violet-500'
                }`}>
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {selectedCategory === "All" ? "Featured Products" : `${selectedCategory} Collection`}
          </h2>
          {selectedCategory !== "All" && (
            <button
              onClick={() => setSelectedCategory("All")}
              className="text-sm font-bold text-violet-600 hover:text-violet-700 transition-colors"
            >
              View All
            </button>
          )}
        </div>
        <ProductGrid selectedCategory={selectedCategory} />
      </div>
    </div>
  );
};

export default Dashboard;
