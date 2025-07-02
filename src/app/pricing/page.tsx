import Link from 'next/link';

export default function PricingPage() {
  return (
    <main className="max-w-xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-semibold mb-4">ALCHM Pricing</h1>
      <p className="text-[#555] mb-6">
        Unlock advanced pathways, reflection analysis, and personalized insights with ALCHM Plus.
      </p>
      <div className="flex flex-col gap-4">
        <Link href="/api/create-checkout-session?tier=rooted" className="bg-green-600 text-white px-6 py-3 rounded">
          Subscribe to Rooted ($6.99/mo)
        </Link>
        <Link href="/api/create-checkout-session?tier=flourish" className="bg-blue-600 text-white px-6 py-3 rounded">
          Subscribe to Flourish ($11.99/mo)
        </Link>
      </div>
    </main>
  );
}
