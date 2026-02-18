import React from "react";
import WebcamPixelGrid from "../components/ui/WebcamPixelGrid";

export default function Home() {
  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">

      <WebcamPixelGrid />

      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="relative z-20 flex h-full items-center justify-center text-white text-center px-6">
        <div>
          <h1 className="text-6xl font-bold">
            Ship stunning landing pages faster.
          </h1>

          <p className="mt-6 text-lg text-white/70 max-w-xl mx-auto">
            Build amazing landing pages with animations.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <button className="px-8 py-3 bg-white text-black rounded-full">
              Get Started
            </button>
            <button className="px-8 py-3 border border-white/30 rounded-full">
              View Docs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
