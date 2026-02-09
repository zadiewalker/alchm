'use client';
import { useState, useMemo } from 'react';
import { transformationEngine, Challenge } from '@/lib/transformationEngine';

export default function ChallengeLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const allChallenges = transformationEngine.getAllChallenges();
  
  const categories = [
    { id: 'all', name: 'All Categories', icon: '✨' },
    { id: 'mindfulness', name: 'Mindfulness', icon: '🧘' },
    { id: 'gratitude', name: 'Gratitude', icon: '🙏' },
    { id: 'shadow_work', name: 'Shadow Work', icon: '🌓' },
    { id: 'connection', name: 'Connection', icon: '🤝' },
    { id: 'creativity', name: 'Creativity', icon: '🎨' },
    { id: 'reflection', name: 'Reflection', icon: '💭' },
    { id: 'action', name: 'Action', icon: '⚡' }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels', color: 'text-white' },
    { id: 'gentle', name: 'Gentle', color: 'text-green-400' },
    { id: 'moderate', name: 'Moderate', color: 'text-blue-400' },
    { id: 'deep', name: 'Deep', color: 'text-purple-400' },
    { id: 'intensive', name: 'Intensive', color: 'text-red-400' }
  ];

  const filteredChallenges = useMemo(() => {
    let filtered = allChallenges;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(challenge => challenge.type === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(challenge => challenge.difficulty === selectedDifficulty);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(challenge => 
        challenge.title.toLowerCase().includes(query) ||
        challenge.description.toLowerCase().includes(query) ||
        challenge.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [selectedCategory, selectedDifficulty, searchQuery, allChallenges]);

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      gentle: 'text-green-400',
      moderate: 'text-blue-400',
      deep: 'text-purple-400',
      intensive: 'text-red-400'
    };
    return colors[difficulty as keyof typeof colors] || 'text-gray-400';
  };

  const getCategoryIcon = (type: string) => {
    const category = categories.find(c => c.id === type);
    return category?.icon || '✨';
  };

  const startChallenge = (challenge: Challenge) => {
    // Store selected challenge for immediate use
    localStorage.setItem('selected_challenge', JSON.stringify(challenge));
    localStorage.setItem('challenge_start_time', new Date().toISOString());
    
    // Navigate to challenge interface or show modal
    setSelectedChallenge(challenge);
  };

  return (
    <div className="challenge-library max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">📚</div>
        <h2 className="text-2xl text-white font-light mb-3">Challenge Library</h2>
        <p className="text-white/70 text-sm">
          Explore our collection of transformation practices and find what resonates with you today
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
        <h3 className="text-white text-lg font-light mb-4">Find Your Perfect Challenge</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Search */}
          <div>
            <label className="block text-white/80 text-sm mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search challenges, tags..."
              className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-white/80 text-sm mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-white/80 text-sm mb-2">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.id} value={difficulty.id}>
                  {difficulty.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map(challenge => (
          <div key={challenge.id} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{getCategoryIcon(challenge.type)}</span>
              <div className="flex-1">
                <h3 className="text-white font-medium">{challenge.title}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white/60">{challenge.estimatedTime} min</span>
                  <span className="text-white/40">•</span>
                  <span className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-white/70 text-sm mb-4 leading-relaxed">
              {challenge.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {challenge.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="bg-purple-600/20 text-purple-200 px-2 py-1 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Adaptive Context Info */}
            {challenge.adaptiveContext && (
              <div className="text-xs text-white/50 mb-4">
                {challenge.adaptiveContext.crisisAdapted && (
                  <span className="bg-green-600/20 text-green-200 px-2 py-1 rounded mr-2">
                    Crisis Safe
                  </span>
                )}
                {!challenge.adaptiveContext.connectionRequired && (
                  <span className="bg-blue-600/20 text-blue-200 px-2 py-1 rounded mr-2">
                    Solo Practice
                  </span>
                )}
                <span className="text-white/40">
                  Mood: {challenge.adaptiveContext.moodRange?.[0]}-{challenge.adaptiveContext.moodRange?.[1]}/10
                </span>
              </div>
            )}

            <button
              onClick={() => startChallenge(challenge)}
              className="w-full bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/30 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Start Challenge
            </button>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredChallenges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">🔍</div>
          <h3 className="text-white text-lg font-light mb-2">No Challenges Found</h3>
          <p className="text-white/50 text-sm">
            Try adjusting your filters or search terms to find more challenges.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setSearchQuery('');
            }}
            className="mt-4 bg-blue-600/30 border border-blue-500/30 text-blue-200 px-4 py-2 rounded-lg hover:bg-blue-600/40 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Challenge Detail Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getCategoryIcon(selectedChallenge.type)}</span>
                <div>
                  <h3 className="text-white text-xl font-medium">{selectedChallenge.title}</h3>
                  <p className="text-white/60 text-sm">
                    {selectedChallenge.category} • {selectedChallenge.estimatedTime} min • 
                    <span className={`${getDifficultyColor(selectedChallenge.difficulty)} ml-1`}>
                      {selectedChallenge.difficulty}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="text-white/60 hover:text-white text-xl"
              >
                ×
              </button>
            </div>

            <p className="text-white/80 mb-6 leading-relaxed">
              {selectedChallenge.description}
            </p>

            <div className="bg-black/30 p-4 rounded-lg mb-6">
              <h4 className="text-white font-medium mb-3">Challenge Prompt:</h4>
              <p className="text-white/90 italic leading-relaxed mb-4">
                "{selectedChallenge.prompt}"
              </p>
              
              <h5 className="text-white/80 text-sm font-medium mb-2">Instructions:</h5>
              <ol className="space-y-2">
                {selectedChallenge.instructions.map((instruction, index) => (
                  <li key={index} className="text-white/70 text-sm flex gap-3">
                    <span className="text-purple-400 font-medium">{index + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedChallenge(null)}
                className="flex-1 bg-gray-600/30 border border-gray-500/30 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Here you would implement the actual challenge start logic
                  // For now, we'll just close the modal and show a message
                  alert('Challenge started! This would normally take you to the practice interface.');
                  setSelectedChallenge(null);
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Begin Challenge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <h3 className="text-white text-lg font-light mb-4 text-center">Challenge Collection</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(1).map(category => {
            const count = transformationEngine.getChallengesByType(category.id as any).length;
            return (
              <div key={category.id} className="text-center">
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="text-white font-medium">{count}</div>
                <div className="text-white/60 text-sm">{category.name}</div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-6">
          <p className="text-white/50 text-sm">
            {allChallenges.length} total challenges designed for your growth journey
          </p>
        </div>
      </div>
    </div>
  );
}