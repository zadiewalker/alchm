'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PathwaysPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const startPathway = async (pathwayId: string) => {
    try {
      console.log('Starting pathway:', pathwayId);
      // Future: Integrate with pathway API
    } catch (error) {
      console.error('Error starting pathway:', error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-sanctuary">
        <div className="text-center">
          <div className="w-8 h-8 bg-white/30 rounded-full animate-gentle-pulse mb-4 mx-auto" />
          <p className="text-white text-lg font-light">Loading your pathway constellation...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen gradient-sanctuary">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation */}
        <nav className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-white/10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Back to Dashboard
          </Link>
        </nav>

        {/* Hero Section */}
        <header className="text-center mb-16 text-white">
          <div className="mb-8">
            <div className="text-white/60 text-sm uppercase tracking-wider mb-2 font-medium">
              Identity Operating System
            </div>
            <h1 className="text-4xl md:text-6xl font-extralight mb-4 tracking-tight">
              Your Pathways
            </h1>
          </div>
          <p className="text-xl md:text-2xl font-light opacity-90 max-w-3xl mx-auto leading-relaxed">
            Discover guided journeys for authentic growth and healing
          </p>
        </header>

        {/* Pathway Categories */}
        <div className="space-y-16">
          {/* Foundation Pathways */}
          <section>
            <div className="text-center mb-12 text-white">
              <h2 className="text-2xl md:text-3xl font-light mb-4">Foundation Pathways</h2>
              <p className="text-white/80 max-w-2xl mx-auto">
                Essential pathways for building your authentic identity foundation
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Self-Discovery", icon: "🔍", description: "Explore your authentic self through guided reflection", duration: "4 weeks" },
                { title: "Emotional Awareness", icon: "🌈", description: "Develop deeper understanding of your emotional patterns", duration: "6 weeks" },
                { title: "Values Clarification", icon: "✨", description: "Identify and align with your core values", duration: "3 weeks" },
                { title: "Boundary Setting", icon: "🛡️", description: "Learn healthy boundary practices for authentic living", duration: "5 weeks" }
              ].map((pathway, index) => (
                <Card 
                  key={index} 
                  variant="sanctuary"
                  interactive
                  className="cursor-pointer group transition-all duration-400 hover:scale-[1.02] min-h-[240px] flex flex-col"
                  onClick={() => startPathway(`foundation-${index}`)}
                >
                  <CardHeader className="text-center flex-1">
                    <div className="text-3xl mb-4 group-hover:animate-gentle-pulse transition-all duration-300">{pathway.icon}</div>
                    <CardTitle level="h3" className="text-sanctuary-gray-800 mb-3">{pathway.title}</CardTitle>
                    <p className="text-sanctuary-gray-600 text-sm leading-relaxed mb-4 flex-1">
                      {pathway.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sanctuary-gray-500 text-xs font-medium">{pathway.duration}</span>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs px-3 py-1.5 h-auto"
                      >
                        Begin
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          
          {/* Growth Pathways */}
          <section>
            <div className="text-center mb-12 text-white">
              <h2 className="text-2xl md:text-3xl font-light mb-4">Growth Pathways</h2>
              <p className="text-white/80 max-w-2xl mx-auto">
                Advanced pathways for deepening your authentic expression
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Creative Expression", icon: "🎨", description: "Explore creativity as a path to authenticity", duration: "8 weeks" },
                { title: "Relationship Dynamics", icon: "🤝", description: "Navigate relationships from your authentic center", duration: "6 weeks" },
                { title: "Purpose Discovery", icon: "🧩", description: "Uncover your unique purpose and calling", duration: "10 weeks" },
                { title: "Leadership Style", icon: "🌟", description: "Develop your authentic leadership approach", duration: "7 weeks" }
              ].map((pathway, index) => (
                <Card 
                  key={index} 
                  variant="sanctuary"
                  interactive
                  className="cursor-pointer group transition-all duration-400 hover:scale-[1.02] min-h-[240px] flex flex-col"
                  onClick={() => startPathway(`growth-${index}`)}
                >
                  <CardHeader className="text-center flex-1">
                    <div className="text-3xl mb-4 group-hover:animate-gentle-pulse transition-all duration-300">{pathway.icon}</div>
                    <CardTitle level="h3" className="text-sanctuary-gray-800 mb-3">{pathway.title}</CardTitle>
                    <p className="text-sanctuary-gray-600 text-sm leading-relaxed mb-4 flex-1">
                      {pathway.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sanctuary-gray-500 text-xs font-medium">{pathway.duration}</span>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs px-3 py-1.5 h-auto"
                      >
                        Begin
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Progress Dashboard */}
        <section className="mt-16">
          <Card variant="sage" className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle level="h2" className="text-white mb-2">Your Identity OS Progress</CardTitle>
              <p className="text-sage-100">Tracking your journey across all dimensions of authentic living</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center text-white">
                  <div className="text-3xl font-extralight mb-2">0</div>
                  <p className="text-sage-100 text-sm font-medium">Active Pathways</p>
                </div>
                <div className="text-center text-white">
                  <div className="text-3xl font-extralight mb-2">0</div>
                  <p className="text-sage-100 text-sm font-medium">Completed</p>
                </div>
                <div className="text-center text-white">
                  <div className="text-3xl font-extralight mb-2">30%</div>
                  <p className="text-sage-100 text-sm font-medium">Coherence</p>
                </div>
                <div className="text-center text-white">
                  <div className="text-3xl font-extralight mb-2">Emerging</div>
                  <p className="text-sage-100 text-sm font-medium">Mastery Level</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Crisis Support Footer */}
        <div className="mt-16 max-w-3xl mx-auto">
          <Card variant="gentle" className="border-2 border-red-200/50">
            <CardContent className="text-center py-8">
              <div className="text-4xl mb-4">🆘</div>
              <CardTitle level="h3" className="text-sanctuary-gray-800 mb-4">
                Crisis Support Available 24/7
              </CardTitle>
              <div className="mb-6">
                <Button
                  onClick={() => window.open('tel:988', '_self')}
                  variant="destructive"
                  size="lg"
                  className="gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call 988 Now
                </Button>
              </div>
              <p className="text-sanctuary-gray-500 text-xs leading-relaxed">
                ALCHM is a journaling platform, not medical treatment or therapy. Ages 17+.
                <br />
                COPPA, GDPR & CCPA compliant. Your data is encrypted and protected.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}