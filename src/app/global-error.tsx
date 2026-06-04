'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error('Global error caught:', error);
  
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-b from-[#A4B792] to-[#8B9A7C] flex flex-col items-center justify-center px-6">
          <div className="text-center text-white">
            <h2 className="text-2xl font-light mb-4">ALCHM</h2>
            <p className="text-white/80 mb-6">Something went wrong</p>
            <button 
              onClick={() => reset()}
              className="px-6 py-2 bg-[#A4B792] text-[#1f2937] rounded-full"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
