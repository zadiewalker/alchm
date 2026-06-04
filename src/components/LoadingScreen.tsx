'use client'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A4B792] to-[#8B9A7C]
                    flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm 
                        flex items-center justify-center mb-6 mx-auto animate-pulse">
          {/* Khepera icon */}
          <svg viewBox="0 0 100 100" className="w-8 h-8 text-white">
            <circle cx="50" cy="12" r="8" fill="currentColor" fillOpacity="0.9" />
            <circle cx="50" cy="26" r="5" fill="currentColor" fillOpacity="0.85" />
            <ellipse cx="50" cy="55" rx="15" ry="23" fill="currentColor" fillOpacity="0.85" />
            <path d="M35 48 Q18 42 22 62 Q24 70 35 65 Z" fill="currentColor" fillOpacity="0.8" />
            <path d="M65 48 Q82 42 78 62 Q76 70 65 65 Z" fill="currentColor" fillOpacity="0.8" />
          </svg>
        </div>
        <p className="text-white/60 text-sm">Loading ALCHM...</p>
        <p className="text-white/40 text-xs mt-2">Preparing your sanctuary</p>
      </div>
    </div>
  )
}
