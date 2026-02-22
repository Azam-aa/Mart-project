import React from "react";
import ProductGrid from "../components/product/ProductGrid";

const Home = () => {
  return (
    <div className="space-y-8">
      <section className="text-center py-12 px-4 bg-gradient-to-br from-primary-50 to-white dark:from-dark dark:to-gray-900 rounded-3xl shadow-inner border border-primary-100 dark:border-gray-800">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-4 animate-fade-in-up">
          Welcome to MartApp
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Discover the latest gadgets and electronics at unbeatable prices. Experience premium shopping today.
        </p>
        <button className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-bold shadow-lg hover:shadow-primary-500/50 transition-all duration-300 transform hover:-translate-y-1">
          Shop Now
        </button>
      </section>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white border-l-4 border-primary-500 pl-4">
            Featured Products
          </h2>
          {/* Filter Component could go here */}
        </div>

        <ProductGrid />
      </div>
    </div>
  );
};

export default Home;
