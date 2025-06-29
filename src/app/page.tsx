// src/app/page.tsx

"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 px-6 py-12">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Welcome to ALCHM
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Transform your daily reflections into meaningful growth. ALCHM helps
          you build micro-reflection habits, discover your archetype, and track
          your journey across personalized pathways.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/pricing"
            className="rounded-md bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition"
          >
            View Pricing
          </Link>
          <Link
            href="/journals"
            className="rounded-md border border-green-600 px-6 py-3 text-green-700 font-semibold hover:bg-green-50 transition"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </main>
  );
}
