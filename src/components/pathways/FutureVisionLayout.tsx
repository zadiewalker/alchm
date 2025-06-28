"use client";

import React from "react";
import Lottie from "lottie-react";
import animationData from "../../animations/future_vision_light_wave.json";
import { PathwayConfig } from "../../types/pathwayConfig";

interface Props {
  config: PathwayConfig;
}

export default function FutureVisionLayout({ config }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-6"
      style={{
        background: `linear-gradient(to bottom, ${config.gradient[0]}, ${config.gradient[1]})`,
      }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-2" style={{ color: config.color }}>
          {config.title}
        </h1>
        <p className="text-lg mb-4">{config.subtitle}</p>
        <em className="text-md">{config.affirmation}</em>
      </div>

      <div className="max-w-md mx-auto my-6">
        <Lottie animationData={animationData} loop className="w-64 h-64 mx-auto" />
      </div>

      <div className="max-w-xl mx-auto text-center mt-6">
        <p className="text-md text-gray-700">
          {/* Dynamic microcopy placeholder */}
          What vision are you holding for your future self today?
        </p>
      </div>
    </div>
  );
}


