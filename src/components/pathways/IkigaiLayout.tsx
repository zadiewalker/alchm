"use client";

import React from "react";
import Lottie from "lottie-react";
import leafAnimation from "../../animations/ikigai_leaf_glow.json";
import { PathwayConfig } from "../../types/pathwayConfig";

interface Props {
  config: PathwayConfig;
}

export default function IkigaiLayout({ config }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-6"
      style={{
        background: `linear-gradient(to bottom, ${config.gradient[0]}, ${config.gradient[1]})`,
      }}
    >
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center">
        <h1
          className="text-4xl font-bold mb-2"
          style={{ color: config.color }}
        >
          {config.title}
        </h1>
        <p className="text-lg mb-4">{config.subtitle}</p>
        <em className="text-md">{config.affirmation}</em>
      </div>

      {/* Animation */}
      <div className="max-w-md mx-auto my-6">
        <Lottie
          animationData={leafAnimation}
          loop
          className="w-64 h-64 mx-auto"
        />
      </div>

      {/* Dynamic Microcopy Block */}
      <div className="max-w-xl mx-auto text-center mt-6 bg-white/40 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2" style={{ color: config.color }}>
          Reflection Prompt
        </h2>
        <p className="text-md text-gray-800">
          What activities make you feel most alive and aligned with your purpose today?
        </p>
      </div>

      {/* Journaling Block */}
      <div className="max-w-xl mx-auto mt-6 w-full">
        <textarea
          placeholder="Write your reflection here..."
          className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#a4b792] shadow-sm"
          rows={6}
        />
        <button
          className="mt-4 w-full bg-[#a4b792] text-white py-3 rounded-lg font-semibold hover:bg-[#8ea87d] transition"
          onClick={() => alert("Reflection saved! (Hook this to Firestore)")}
        >
          Save Reflection
        </button>
      </div>
    </div>
  );
}

