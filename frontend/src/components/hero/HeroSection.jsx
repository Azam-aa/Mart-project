import React from "react";
import { IconArrowRight } from "@tabler/icons-react";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center text-center px-6 overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90 z-0" />

      <div className="relative z-10 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Build Modern E-Commerce <br />
          <span className="text-gray-400">With Stunning UI</span>
        </h1>

        <p className="mt-6 text-lg text-gray-300">
          Powered by React, Tailwind and Aceternity UI components.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium hover:scale-105 transition">
            Get Started <IconArrowRight size={18} />
          </button>

          <button className="px-6 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition">
            View Docs
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
