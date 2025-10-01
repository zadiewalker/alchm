'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useMoodContext, MoodType } from './MoodSelector';

// Poetry analysis types
interface MetaphorAnalysis {
  metaphor: string;
  meaning: string;
  emotionalWeight: number;
  universality: 'personal' | 'cultural' | 'universal';
}

interface PoetryMetrics {
  wordCount: number;
  lineCount: number;
  averageLineLength: number;
  emotionalIntensity: number;
  metaphorDensity: number;
  rhythmScore: number;
}

interface PoetryEntry {
  id: string;
  text: string;
  title?: string;
  form: PoetryForm;
  mood?: MoodType;
  aiCollaboration: AICollaborationType;
  analysis: PoetryAnalysis;
  timestamp: Date;
  revisions: string[];
}

interface PoetryAnalysis {
  themes: string[];
  metaphors: MetaphorAnalysis[];
  emotionalArc: string[];
  metrics: PoetryMetrics;
  therapeuticInsights: string[];
  strongestLines: string[];
}

type PoetryForm = 'free_verse' | 'haiku' | 'sonnet' | 'prose_poem' | 'list_poem' | 'acrostic';
type AICollaborationType = 'none' | 'prompts' | 'suggestions' | 'collaborative' | 'call_and_response';

interface PoetryLabProps {
  onPoemComplete?: (poem: PoetryEntry) => void;
  className?: string;
}

// Poetry prompts organized by therapeutic intention
const THERAPEUTIC_PROMPTS = {
  healing: [
    "What does healing sound like in your body?",
    "Write about a scar that tells a story of strength",
    "If your pain could speak, what would it say?",
    "Describe the moment you realized you were enough"
  ],
  growth: [
    "What are you becoming?",
    "Write about the voice you're learning to trust",
    "Describe the garden growing in your chest",
    "What seeds are you planting for tomorrow?"
  ],
  release: [
    "What are you ready to let go of?",
    "Write a letter to your younger self",
    "Describe the weight you're setting down",
    "What would freedom feel like in your bones?"
  ],
  connection: [
    "Who do you carry with you?",
    "Write about hands that held you",
    "Describe the invisible threads that bind us",
    "What does belonging taste like?"
  ],
  resilience: [
    "How many times have you risen?",
    "Write about the fire that won't go out",
    "Describe your unbreakable parts",
    "What makes you unstoppable?"
  ]
};

// AI collaboration templates
const AI_COLLABORATION_STYLES = {
  prompts: {
    name: "Gentle Prompting",
    description: "AI offers thoughtful questions to deepen your exploration"
  },
  suggestions: {
    name: "Word Weaving",
    description: "AI suggests words and phrases to enhance your expression"
  },
  collaborative: {
    name: "Creative Partnership",
    description: "You and AI build the poem together, line by line"
  },
  call_and_response: {
    name: "Call and Response",
    description: "You write a stanza, AI responds, creating a dialogue"
  }
};

const PoetryLab: React.FC<PoetryLabProps> = ({
  onPoemComplete,
  className = ''
}) => {
  const [poemText, setPoemText] = useState('');
  const [poemTitle, setPoemTitle] = useState('');
  const [selectedForm, setSelectedForm] = useState<PoetryForm>('free_verse');
  const [aiMode, setAiMode] = useState<AICollaborationType>('prompts');
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PoetryAnalysis | null>(null);
  const [revisionHistory, setRevisionHistory] = useState<string[]>([]);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { currentMood, getMoodData } = useMoodContext();

  // Memoized poetry forms with guidance
  const poetryForms = useMemo(() => ({
    free_verse: {
      name: "Free Verse",
      description: "Let your words flow without constraint",
      guidance: "No rules, just authentic expression"
    },
    haiku: {
      name: "Haiku",
      description: "Three lines capturing a moment",
      guidance: "5-7-5 syllables, focus on imagery and emotion"
    },
    sonnet: {
      name: "Sonnet",
      description: "Fourteen lines of structured beauty",
      guidance: "Traditional form for deep contemplation"
    },
    prose_poem: {
      name: "Prose Poem",
      description: "Poetry in paragraph form",
      guidance: "Narrative meets poetic language"
    },
    list_poem: {
      name: "List Poem",
      description: "Catalog of thoughts, feelings, or images",
      guidance: "Each line begins similarly, building power"
    },
    acrostic: {
      name: "Acrostic",
      description: "First letters spell a meaningful word",
      guidance: "Use your name, a value, or an emotion"
    }
  }), []);

  // Generate therapeutic prompt
  const generatePrompt = useCallback(() => {
    const moodData = currentMood ? getMoodData(currentMood) : null;
    let promptCategory: keyof typeof THERAPEUTIC_PROMPTS = 'healing';
    
    if (moodData) {
      if (moodData.name === 'Empowered') promptCategory = 'resilience';
      else if (moodData.name === 'Grateful') promptCategory = 'connection';
      else if (moodData.name === 'Contemplative') promptCategory = 'growth';
      else if (moodData.name === 'Raw') promptCategory = 'release';
      else if (moodData.name === 'Tender') promptCategory = 'healing';
    }
    
    const prompts = THERAPEUTIC_PROMPTS[promptCategory];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(randomPrompt);
  }, [currentMood, getMoodData]);

  // Mock AI suggestions based on current text
  const generateAISuggestions = useCallback((text: string) => {
    if (!text.trim() || aiMode === 'none') return;
    
    const words = text.toLowerCase().split(/\s+/);
    const lastLine = text.split('\n').pop()?.trim() || '';
    
    // Generate contextual suggestions based on mood and content
    const suggestions = [];
    
    if (words.includes('heart')) {
      suggestions.push('beating like thunder', 'whispering secrets', 'carrying ancient wisdom');
    }
    
    if (words.includes('pain')) {
      suggestions.push('that teaches', 'becoming strength', 'transforming into light');
    }
    
    if (words.includes('love')) {
      suggestions.push('fierce and tender', 'like morning dew', 'that changes everything');
    }
    
    if (currentMood === 'raw') {
      suggestions.push('unfiltered truth', 'bones remembering', 'wild and necessary');
    } else if (currentMood === 'grateful') {
      suggestions.push('abundance overflowing', 'grateful tears', 'blessed with presence');
    }
    
    // Add line continuation suggestions
    if (lastLine.endsWith(',')) {
      suggestions.push('where silence speaks', 'in the space between breaths', 'until dawn breaks');
    }
    
    setAiSuggestions(suggestions.slice(0, 3));
  }, [aiMode, currentMood]);

  // Analyze poetry for therapeutic insights
  const analyzePoetry = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    
    // Mock analysis (replace with actual AI analysis)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lines = text.split('\n').filter(line => line.trim());
    const words = text.split(/\s+/).filter(word => word.length > 0);
    
    // Extract metaphors (simplified detection)
    const metaphorPatterns = [
      /like a?n? ([^,.\n]+)/gi,
      /as ([^,.\n]+) as/gi,
      /is a?n? ([^,.\n]+)/gi,
      /becomes? ([^,.\n]+)/gi
    ];
    
    const metaphors: MetaphorAnalysis[] = [];
    metaphorPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          metaphors.push({
            metaphor: match.trim(),
            meaning: "Symbolic expression of inner experience",
            emotionalWeight: 0.7 + Math.random() * 0.3,
            universality: Math.random() > 0.5 ? 'universal' : 'personal'
          });
        });
      }
    });
    
    // Identify themes based on word frequency and context
    const themes = [];
    if (/love|heart|soul|connect/i.test(text)) themes.push('Connection');
    if (/pain|hurt|scar|wound/i.test(text)) themes.push('Healing');
    if (/grow|change|become|transform/i.test(text)) themes.push('Transformation');
    if (/strong|power|rise|stand/i.test(text)) themes.push('Resilience');
    if (/beautiful|light|joy|peace/i.test(text)) themes.push('Beauty');
    
    // Calculate metrics
    const metrics: PoetryMetrics = {
      wordCount: words.length,
      lineCount: lines.length,
      averageLineLength: words.length / Math.max(lines.length, 1),
      emotionalIntensity: (text.match(/[!?.]/g)?.length || 0) / words.length,
      metaphorDensity: metaphors.length / words.length,
      rhythmScore: 0.5 + Math.random() * 0.5
    };
    
    // Generate therapeutic insights
    const insights = [
      `Your ${words.length} words create a ${metrics.emotionalIntensity > 0.05 ? 'powerful' : 'gentle'} emotional landscape`,
      themes.length > 0 ? `Core themes of ${themes.join(', ').toLowerCase()} emerge from your expression` : 'Your unique perspective shines through each line',
      metaphors.length > 0 ? `Your metaphors reveal deep symbolic thinking about your experience` : 'Your direct expression carries authentic emotional weight',
      `This poem captures a moment of ${currentMood || 'authentic'} truth-telling`
    ];
    
    // Find strongest lines (simplified scoring)
    const strongestLines = lines
      .map(line => ({
        text: line,
        score: line.length * 0.1 + (line.match(/[!?.]/g)?.length || 0) * 0.5 + Math.random() * 0.3
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.text);
    
    const analysisResult: PoetryAnalysis = {
      themes,
      metaphors,
      emotionalArc: lines.length > 3 ? ['Opening', 'Development', 'Resolution'] : ['Expression'],
      metrics,
      therapeuticInsights: insights,
      strongestLines
    };
    
    setAnalysis(analysisResult);
    setIsAnalyzing(false);
  }, [currentMood]);

  // Handle text changes with AI assistance
  const handleTextChange = useCallback((newText: string) => {
    setPoemText(newText);
    
    // Save revision if significant change
    if (poemText.length > 0 && Math.abs(newText.length - poemText.length) > 20) {
      setRevisionHistory(prev => [...prev, poemText]);
    }
    
    // Generate AI suggestions
    if (aiMode !== 'none') {
      generateAISuggestions(newText);
    }
  }, [poemText, aiMode, generateAISuggestions]);

  // Apply AI suggestion
  const applySuggestion = useCallback((suggestion: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const cursorPos = textarea.selectionStart;
    const textBefore = poemText.substring(0, cursorPos);
    const textAfter = poemText.substring(cursorPos);
    
    // Add suggestion with appropriate spacing
    const needsSpace = textBefore.length > 0 && !textBefore.endsWith(' ') && !textBefore.endsWith('\n');
    const newText = textBefore + (needsSpace ? ' ' : '') + suggestion + textAfter;
    
    setPoemText(newText);
    
    // Update cursor position
    setTimeout(() => {
      const newPos = cursorPos + suggestion.length + (needsSpace ? 1 : 0);
      textarea.setSelectionRange(newPos, newPos);
      textarea.focus();
    }, 0);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
  }, [poemText]);

  // Save poem
  const savePeom = useCallback(() => {
    if (!poemText.trim()) return;
    
    const poemEntry: PoetryEntry = {
      id: Date.now().toString(),
      text: poemText,
      title: poemTitle || undefined,
      form: selectedForm,
      mood: currentMood || undefined,
      aiCollaboration: aiMode,
      analysis: analysis || {
        themes: [],
        metaphors: [],
        emotionalArc: [],
        metrics: {
          wordCount: 0,
          lineCount: 0,
          averageLineLength: 0,
          emotionalIntensity: 0,
          metaphorDensity: 0,
          rhythmScore: 0
        },
        therapeuticInsights: [],
        strongestLines: []
      },
      timestamp: new Date(),
      revisions: revisionHistory
    };
    
    // Save to localStorage
    const savedPoems = JSON.parse(localStorage.getItem('alchm_poetry') || '[]');
    savedPoems.push(poemEntry);
    localStorage.setItem('alchm_poetry', JSON.stringify(savedPoems));
    
    onPoemComplete?.(poemEntry);
    
    // Success feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  }, [poemText, poemTitle, selectedForm, currentMood, aiMode, analysis, revisionHistory, onPoemComplete]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(200, textarea.scrollHeight) + 'px';
    }
  }, [poemText]);

  return (
    <div className={`poetry-lab ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Poetry Laboratory
        </h3>
        <p className="text-sm text-gray-600">
          Transform experiences into verses with AI collaboration
        </p>
      </div>

      {/* Configuration Panel */}
      <div className="config-panel grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-sage-50 rounded-2xl">
        
        {/* Poetry Form Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Poetry Form</label>
          <select
            value={selectedForm}
            onChange={(e) => setSelectedForm(e.target.value as PoetryForm)}
            className="w-full p-3 rounded-lg border border-sage-200 bg-white text-sm focus:ring-2 focus:ring-sage-300 focus:border-transparent"
          >
            {Object.entries(poetryForms).map(([key, form]) => (
              <option key={key} value={key}>
                {form.name} - {form.description}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-600 mt-1">
            {poetryForms[selectedForm].guidance}
          </p>
        </div>

        {/* AI Collaboration Mode */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">AI Collaboration</label>
          <select
            value={aiMode}
            onChange={(e) => setAiMode(e.target.value as AICollaborationType)}
            className="w-full p-3 rounded-lg border border-sage-200 bg-white text-sm focus:ring-2 focus:ring-sage-300 focus:border-transparent"
          >
            <option value="none">Solo Writing</option>
            {Object.entries(AI_COLLABORATION_STYLES).map(([key, style]) => (
              <option key={key} value={key}>
                {style.name}
              </option>
            ))}
          </select>
          {aiMode !== 'none' && (
            <p className="text-xs text-gray-600 mt-1">
              {AI_COLLABORATION_STYLES[aiMode as keyof typeof AI_COLLABORATION_STYLES].description}
            </p>
          )}
        </div>
      </div>

      {/* Therapeutic Prompt */}
      {currentPrompt && (
        <div className="prompt-section mb-6 p-4 bg-gradient-to-r from-sage-100 to-green-100 rounded-2xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Therapeutic Prompt</h4>
              <p className="text-gray-800 italic leading-relaxed">"{currentPrompt}"</p>
            </div>
            <button
              onClick={() => setCurrentPrompt(null)}
              className="text-gray-400 hover:text-gray-600 ml-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Writing Interface */}
      <div className="writing-interface bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
        
        {/* Title Input */}
        <input
          type="text"
          value={poemTitle}
          onChange={(e) => setPoemTitle(e.target.value)}
          placeholder="Poem title (optional)"
          className="w-full p-3 mb-4 rounded-lg border border-sage-200 text-lg font-semibold text-gray-800 focus:ring-2 focus:ring-sage-300 focus:border-transparent"
        />

        {/* Main Text Area */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={poemText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={currentPrompt || "Let your words emerge like breathing..."}
            className="w-full p-4 rounded-lg border border-sage-200 resize-none text-gray-800 leading-relaxed text-lg focus:ring-2 focus:ring-sage-300 focus:border-transparent"
            style={{
              minHeight: '200px',
              fontFamily: 'Georgia, serif',
              lineHeight: selectedForm === 'haiku' ? '2' : '1.8'
            }}
          />
          
          {poemText.length === 0 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="text-4xl mb-2 opacity-30">✨</div>
              <p className="text-gray-400 text-sm">Your poetry sanctuary awaits</p>
            </div>
          )}
        </div>

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && aiMode !== 'none' && (
          <div className="ai-suggestions mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">AI Suggestions</h4>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => applySuggestion(suggestion)}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons flex flex-wrap items-center justify-between mt-6 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={generatePrompt}
              className="px-4 py-2 bg-sage-100 text-sage-700 rounded-lg text-sm font-medium hover:bg-sage-200 transition-colors"
            >
              ✨ Get Prompt
            </button>
            
            {poemText.length > 0 && (
              <>
                <button
                  onClick={() => analyzePoetry(poemText)}
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors disabled:opacity-50"
                >
                  {isAnalyzing ? '🔄 Analyzing...' : '🔍 Analyze'}
                </button>
                
                <button
                  onClick={() => setShowAnalysis(!showAnalysis)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showAnalysis 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {showAnalysis ? 'Hide Analysis' : 'Show Analysis'}
                </button>
              </>
            )}
          </div>
          
          <button
            onClick={savePeom}
            disabled={!poemText.trim()}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              poemText.trim()
                ? 'bg-sage-400 text-white hover:bg-sage-500'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Save Poem
          </button>
        </div>

        {/* Word Count */}
        <div className="text-center mt-4">
          <span className="text-xs text-gray-500">
            {poemText.split(/\s+/).filter(w => w.length > 0).length} words • {poemText.split('\n').length} lines
          </span>
        </div>
      </div>

      {/* Poetry Analysis */}
      {showAnalysis && analysis && (
        <div className="analysis-panel mt-6 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Poetry Analysis</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Themes and Insights */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Themes</h5>
              <div className="flex flex-wrap gap-2 mb-4">
                {analysis.themes.map((theme, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm">
                    {theme}
                  </span>
                ))}
              </div>
              
              <h5 className="font-semibold text-gray-700 mb-2">Therapeutic Insights</h5>
              <div className="space-y-2">
                {analysis.therapeuticInsights.map((insight, i) => (
                  <p key={i} className="text-sm text-gray-700 leading-relaxed">
                    • {insight}
                  </p>
                ))}
              </div>
            </div>
            
            {/* Metrics and Highlights */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Strongest Lines</h5>
              <div className="space-y-2 mb-4">
                {analysis.strongestLines.map((line, i) => (
                  <p key={i} className="text-sm italic text-gray-800 pl-3 border-l-2 border-sage-300">
                    {line}
                  </p>
                ))}
              </div>
              
              <h5 className="font-semibold text-gray-700 mb-2">Metrics</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Emotional Intensity:</span>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-sage-400 h-2 rounded-full"
                      style={{ width: `${Math.min(100, analysis.metrics.emotionalIntensity * 1000)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Rhythm Score:</span>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-400 h-2 rounded-full"
                      style={{ width: `${analysis.metrics.rhythmScore * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoetryLab;