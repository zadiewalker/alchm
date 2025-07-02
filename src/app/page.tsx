// src/app/page.tsx

"use client";

import Link from "next/link";

import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ALCHM – Reflect, Reset, Grow",
  description: "A gentle space to reflect, reset, and grow at your own pace with ALCHM.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f7f2] text-[#2e2e2e] flex flex-col items-center justify-center px-4 py-8">
      {/* Hero Section */}
      <section className="max-w-2xl text-center space-y-4">
        <div className="text-5xl font-bold flex items-center justify-center gap-2">
          <span>Welcome to ALCHM</span> <span className="text-[#a4b792]">🌿</span>
        </div>
        <p className="text-lg text-[#2e2e2e]/80">
          A gentle space to reflect, reset, and grow at your own pace.
        </p>
        {/* Optional calming animation placeholder */}
        <div className="w-full mt-6">
          <Image
            src="/calm-placeholder.png"
            alt="Calming visual for reflection"
            width={600}
            height={400}
            className="rounded-lg shadow-lg mx-auto"
          />
        </div>
      </section>

      {/* Call to Actions */}
      <section className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link
          href="/journals"
          className="bg-[#a4b792] text-white px-6 py-3 rounded-full font-medium hover:bg-[#8ea77f] transition"
        >
          🌱 Begin Your Reflection
        </Link>
        <Link
          href="/about"
          className="border border-[#a4b792] text-[#a4b792] px-6 py-3 rounded-full font-medium hover:bg-[#a4b792]/10 transition"
        >
          📖 Learn How ALCHM Works
        </Link>
      </section>

      {/* Features Section */}
      <section className="mt-16 max-w-xl bg-[#eeddd3] p-6 rounded-lg shadow text-left space-y-2">
        <h2 className="text-xl font-semibold text-[#2e2e2e]">
          ✨ Ready to check in with yourself today?
        </h2>
        <ul className="list-disc list-inside text-[#2e2e2e]/80 space-y-1">
          <li>Reflect on your day with gentle prompts</li>
          <li>Track your feelings, wins, and lessons privately</li>
          <li>Build your personal growth journey securely</li>
        </ul>
      </section>

      {/* Optional Pathways Preview */}
      <section className="mt-12 text-center max-w-2xl space-y-4">
        <h3 className="text-2xl font-bold text-[#2e2e2e]">🌿 Explore Your Pathways</h3>
        <p className="text-[#2e2e2e]/80">
          Choose pathways like Identity, Alchemy, or Future Vision to guide your reflections and growth.
        </p>
        <Link
          href="/pathways"
          className="bg-[#cb997e] text-white px-5 py-2 rounded-full font-medium hover:bg-[#b98169] transition"
        >
          🌼 Explore Pathways
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-16 text-sm text-[#2e2e2e]/60">
        © {new Date().getFullYear()} ALCHM. Grow at your own pace.
      </footer>
    </main>
  );
}
