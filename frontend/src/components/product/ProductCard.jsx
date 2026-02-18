import React from "react";

const ProductCard = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-xl p-6 hover:scale-105 transition duration-300">
      <img
        src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
        alt="product"
        className="rounded-lg h-48 w-full object-cover"
      />

      <h2 className="mt-4 text-xl font-semibold">MacBook Pro</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        High performance laptop.
      </p>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-lg font-bold">₹1,20,000</span>
        <button className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
