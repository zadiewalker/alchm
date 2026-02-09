'use client';
import { useState, useEffect } from 'react';
import { useData } from '@/hooks/useData';

interface DreamEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  emotions: string[];
  symbols: string[];
  themes: string[];
  insights: string[];
  intensity: number;
}

export default function DreamAnalysis() {
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [currentDream, setCurrentDream] = useState({
    title: '',
    content: '',
    emotions: [] as string[],
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data persistence
  const { saveDreamEntry, getDreamEntries, isInitialized } = useData();

  useEffect(() => {
    if (isInitialized) {
      loadDreams();
    }
  }, [isInitialized]);

  const loadDreams = async () => {
    try {
      setIsLoading(true);
      const dreamData = await getDreamEntries();
      // Convert to the format expected by this component
      const formattedDreams = dreamData.map(dream => ({
        id: dream.id,
        date: dream.createdAt.toISOString(),
        title: dream.title,
        content: dream.content,
        emotions: dream.emotions,
        symbols: dream.symbols,
        themes: dream.themes,
        insights: dream.insights,
        intensity: dream.intensity
      }));
      setDreams(formattedDreams);
    } catch (error) {
      console.error('Error loading dreams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dreamSymbols = {
    'water': { meaning: 'Emotions, subconscious, cleansing, flow of life', shadow: 'Overwhelming emotions, drowning in feelings' },
    'fire': { meaning: 'Passion, transformation, destruction and renewal', shadow: 'Destructive anger, burning out' },
    'death': { meaning: 'Endings, transformation, rebirth', shadow: 'Fear of change, resistance to growth' },
    'falling': { meaning: 'Loss of control, letting go, trust issues', shadow: 'Fear of failure, lack of support' },
    'flying': { meaning: 'Freedom, transcendence, rising above', shadow: 'Escapism, avoiding reality' },
    'shadow': { meaning: 'Hidden aspects, rejected parts, wholeness', shadow: 'Disowned self, fear of darkness' },
    'house': { meaning: 'Self, psyche, different levels of consciousness', shadow: 'Fragmented identity, hidden rooms' },
    'mirror': { meaning: 'Self-reflection, truth, seeing clearly', shadow: 'Self-deception, distorted self-image' },
    'snake': { meaning: 'Transformation, healing, hidden wisdom', shadow: 'Betrayal, hidden threats, sexuality' },
    'darkness': { meaning: 'Unknown, mystery, potential for growth', shadow: 'Fear, depression, unconscious fears' }
  };

  const analyzeDream = async () => {
    if (!currentDream.content.trim()) return;

    setIsAnalyzing(true);

    // Symbol detection
    const detectedSymbols: string[] = [];
    const detectedThemes: string[] = [];
    const generatedInsights: string[] = [];

    const content = currentDream.content.toLowerCase();

    // Find dream symbols
    Object.keys(dreamSymbols).forEach(symbol => {
      if (content.includes(symbol)) {
        detectedSymbols.push(symbol);
        
        const symbolData = dreamSymbols[symbol as keyof typeof dreamSymbols];
        generatedInsights.push(`${symbol}: ${symbolData.meaning}`);
        
        // Check for shadow elements
        if (content.includes('dark') || content.includes('fear') || content.includes('scared')) {
          generatedInsights.push(`Shadow aspect of ${symbol}: ${symbolData.shadow}`);
        }
      }
    });

    // Detect themes
    const themePatterns = [
      { pattern: /(chase|chasing|running|escape)/g, theme: 'Avoidance/Pursuit' },
      { pattern: /(lost|searching|finding|looking)/g, theme: 'Seeking/Lost' },
      { pattern: /(family|mother|father|child)/g, theme: 'Family Dynamics' },
      { pattern: /(work|job|boss|office)/g, theme: 'Career/Authority' },
      { pattern: /(love|romance|relationship|partner)/g, theme: 'Relationships/Love' },
      { pattern: /(school|exam|test|learning)/g, theme: 'Learning/Performance' },
      { pattern: /(animal|creature|beast)/g, theme: 'Instincts/Primal Nature' }
    ];

    themePatterns.forEach(({ pattern, theme }) => {
      if (pattern.test(content)) {
        detectedThemes.push(theme);
      }
    });

    // Emotional intensity analysis
    const emotionalWords = ['intense', 'overwhelming', 'peaceful', 'scary', 'beautiful', 'strange', 'vivid'];
    let intensity = 0;
    
    emotionalWords.forEach(word => {
      if (content.includes(word)) intensity += 1;
    });

    // Generate personalized insights based on shadow work
    const shadowInsights = [
      "What aspects of yourself might this dream be revealing?",
      "How does this dream reflect your current life challenges?",
      "What is your subconscious trying to integrate or heal?",
      "What shadow aspects might be seeking acknowledgment?"
    ];

    if (detectedSymbols.length > 0) {
      generatedInsights.push(shadowInsights[Math.floor(Math.random() * shadowInsights.length)]);
    }

    setTimeout(async () => {
      try {
        // Save to persistence layer
        const dreamId = await saveDreamEntry({
          title: currentDream.title || 'Untitled Dream',
          content: currentDream.content,
          emotions: currentDream.emotions,
          symbols: detectedSymbols,
          themes: detectedThemes,
          insights: generatedInsights,
          intensity: Math.min(intensity, 10),
          createdAt: new Date()
        });

        // Add to local state for immediate UI update
        const newDream: DreamEntry = {
          id: dreamId,
          date: new Date().toISOString(),
          title: currentDream.title || 'Untitled Dream',
          content: currentDream.content,
          emotions: currentDream.emotions,
          symbols: detectedSymbols,
          themes: detectedThemes,
          insights: generatedInsights,
          intensity: Math.min(intensity, 10)
        };

        setDreams(prev => [newDream, ...prev]);
        setCurrentDream({ title: '', content: '', emotions: [] });
        setShowAnalysis(true);
      } catch (error) {
        console.error('Error saving dream:', error);
        // Still show the analysis even if save fails
        setShowAnalysis(true);
      } finally {
        setIsAnalyzing(false);
      }
    }, 2000);
  };

  const addEmotion = (emotion: string) => {
    if (!currentDream.emotions.includes(emotion)) {
      setCurrentDream(prev => ({
        ...prev,
        emotions: [...prev.emotions, emotion]
      }));
    }
  };

  const removeEmotion = (emotion: string) => {
    setCurrentDream(prev => ({
      ...prev,
      emotions: prev.emotions.filter(e => e !== emotion)
    }));
  };

  const emotionOptions = [
    'peaceful', 'anxious', 'confused', 'excited', 'scared', 'sad', 'angry', 
    'joyful', 'mysterious', 'intense', 'surreal', 'nostalgic'
  ];

  return (
    <div className="dream-analysis max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🌙</div>
        <h2 className="text-2xl text-white font-light mb-3">Dream & Intuition Analysis</h2>
        <p className="text-white/70 text-sm">
          Explore the wisdom of your subconscious through dream interpretation and shadow integration
        </p>
      </div>

      {/* Dream Entry Form */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6">
        <h3 className="text-white text-lg font-light mb-4">Record Your Dream</h3>
        
        <div className="space-y-4">
          <input
            type="text"
            value={currentDream.title}
            onChange={(e) => setCurrentDream(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Dream title (optional)"
            className="w-full bg-black/30 border border-gray-500/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
          
          <textarea
            value={currentDream.content}
            onChange={(e) => setCurrentDream(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Describe your dream in detail... Include emotions, symbols, people, places, and any memorable moments."
            className="w-full h-40 bg-black/30 border border-gray-500/20 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 leading-relaxed"
          />

          {/* Emotion Tags */}
          <div>
            <p className="text-white/80 text-sm mb-2">How did the dream feel?</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {emotionOptions.map(emotion => (
                <button
                  key={emotion}
                  onClick={() => addEmotion(emotion)}
                  className={`px-3 py-1 rounded-full text-xs transition-all duration-200 ${
                    currentDream.emotions.includes(emotion)
                      ? 'bg-purple-600/40 text-purple-200 border border-purple-500/40'
                      : 'bg-gray-700/40 text-gray-300 hover:bg-gray-600/40 border border-gray-500/20'
                  }`}
                >
                  {emotion}
                </button>
              ))}
            </div>
            
            {/* Selected Emotions */}
            {currentDream.emotions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentDream.emotions.map(emotion => (
                  <div
                    key={emotion}
                    className="bg-purple-600/30 text-purple-200 px-3 py-1 rounded-full text-xs flex items-center gap-2 border border-purple-500/30"
                  >
                    {emotion}
                    <button
                      onClick={() => removeEmotion(emotion)}
                      className="text-purple-300 hover:text-purple-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={analyzeDream}
            disabled={!currentDream.content.trim() || isAnalyzing}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
              currentDream.content.trim() && !isAnalyzing
                ? 'bg-purple-600/30 hover:bg-purple-600/40 text-white border border-purple-500/30'
                : 'bg-gray-600/20 text-gray-400 cursor-not-allowed border border-gray-500/20'
            }`}
          >
            {isAnalyzing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
                Analyzing dream symbolism...
              </div>
            ) : (
              'Analyze Dream'
            )}
          </button>
        </div>
      </div>

      {/* Dream History */}
      {dreams.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-white text-lg font-light">Your Dream Journal</h3>
          
          {dreams.map((dream) => (
            <div key={dream.id} className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-white font-light text-lg">{dream.title}</h4>
                  <p className="text-white/60 text-sm">{new Date(dream.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <div className="text-indigo-300 text-sm">Intensity: {dream.intensity}/10</div>
                  <div className="flex gap-1 mt-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < dream.intensity ? 'bg-indigo-400' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-indigo-200 text-sm font-light mb-2">Dream Content</h5>
                  <p className="text-white/80 text-sm leading-relaxed mb-4">{dream.content}</p>
                  
                  {dream.emotions.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-indigo-200 text-sm font-light mb-2">Emotions</h5>
                      <div className="flex flex-wrap gap-2">
                        {dream.emotions.map(emotion => (
                          <span key={emotion} className="bg-indigo-600/20 text-indigo-200 px-2 py-1 rounded text-xs">
                            {emotion}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {dream.symbols.length > 0 && (
                    <div>
                      <h5 className="text-purple-200 text-sm font-light mb-2">Symbols Detected</h5>
                      <div className="flex flex-wrap gap-2">
                        {dream.symbols.map(symbol => (
                          <span key={symbol} className="bg-purple-600/20 text-purple-200 px-2 py-1 rounded text-xs">
                            {symbol}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {dream.themes.length > 0 && (
                    <div>
                      <h5 className="text-yellow-200 text-sm font-light mb-2">Themes</h5>
                      <div className="flex flex-wrap gap-2">
                        {dream.themes.map(theme => (
                          <span key={theme} className="bg-yellow-600/20 text-yellow-200 px-2 py-1 rounded text-xs">
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {dream.insights.length > 0 && (
                    <div>
                      <h5 className="text-green-200 text-sm font-light mb-2">Insights & Shadow Work</h5>
                      <div className="space-y-2">
                        {dream.insights.map((insight, index) => (
                          <div key={index} className="bg-black/20 p-3 rounded-lg border border-green-500/10">
                            <p className="text-green-100 text-xs italic">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 text-sm">Loading your dream journal...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && dreams.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">💤</div>
          <p className="text-white/50 text-sm">Your dream journal is waiting for its first entry...</p>
        </div>
      )}
    </div>
  );
}