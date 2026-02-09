import Link from 'next/link';

// Force static generation  
export const dynamic = 'force-static';
export const revalidate = false;

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A8B09E] to-[#8B9A7C] flex flex-col">
      {/* Radial Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.05)_0%,_transparent_50%)]" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Header - Following Design Lockdown Layout */}
        <header className="px-6 pt-14 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/50 text-base mb-1">
                Good morning
              </p>
              <h1 className="text-white text-3xl font-light">Your Sanctuary</h1>
            </div>
            <Link
              href="/settings"
              className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/15 transition-all duration-200 mt-1"
            >
              ⚙️
            </Link>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 px-6 pb-32 overflow-y-auto">
          
          {/* Khepera Hero Card - Following Glass Card System */}
          <section className="mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-5 text-2xl">
                🪲
              </div>
              
              <p className="text-white/90 text-lg leading-relaxed mb-1">
                "What's present for you today?"
              </p>
              <p className="text-white/50 text-sm mb-5">
                — Khepera
              </p>
              
              {/* Primary Golden Button */}
              <Link 
                href="/journal/new"
                className="inline-block px-8 py-3 bg-[#E5C97D] rounded-full text-white text-sm font-medium uppercase tracking-wider transition-all duration-300 hover:bg-[#F2D99D] hover:-translate-y-0.5 active:scale-[0.98] min-h-[44px] flex items-center"
                style={{
                  boxShadow: '0 4px 16px rgba(255,255,255,0.1)',
                }}
              >
                Begin Writing
              </Link>
            </div>
          </section>

          {/* Navigation Cards - Following Glass Card System */}
          <section className="space-y-3">
            
            <Link 
              href="/journal"
              className="flex items-center justify-between p-5 rounded-2xl bg-white/7 border border-white/8 hover:bg-white/10 transition-all duration-200 group"
            >
              <div>
                <div className="text-white/90 text-base font-medium mb-0.5">
                  Journal
                </div>
                <div className="text-white/50 text-sm">
                  Your past reflections
                </div>
              </div>
              <span className="text-white/30 group-hover:text-white/50 transition-colors">→</span>
            </Link>
            
            <Link 
              href="/insights"
              className="flex items-center justify-between p-5 rounded-2xl bg-white/7 border border-white/8 hover:bg-white/10 transition-all duration-200 group"
            >
              <div>
                <div className="text-white/90 text-base font-medium mb-0.5">
                  Insights
                </div>
                <div className="text-white/50 text-sm">
                  Patterns Khepera has noticed
                </div>
              </div>
              <span className="text-white/30 group-hover:text-white/50 transition-colors">→</span>
            </Link>
            
            <Link 
              href="/pathways"
              className="flex items-center justify-between p-5 rounded-2xl bg-white/7 border border-white/8 hover:bg-white/10 transition-all duration-200 group"
            >
              <div>
                <div className="text-white/90 text-base font-medium mb-0.5">
                  Pathways
                </div>
                <div className="text-white/50 text-sm">
                  Guided healing journeys
                </div>
              </div>
              <span className="text-white/30 group-hover:text-white/50 transition-colors">→</span>
            </Link>
            
          </section>

        </main>
      </div>
      
      {/* Crisis Footer - Following Design Lockdown */}
      <div className="fixed bottom-0 left-0 right-0 pb-8 pt-4 bg-gradient-to-t from-[#8B9A7C] to-transparent">
        <p className="text-white/40 text-xs text-center tracking-wide">
          Crisis support available · 988
        </p>
      </div>
    </div>
  )
}
