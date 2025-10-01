'use client';

import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { useMoodContext, MoodType } from './MoodSelector';

// Drawing tools and modes
type BrushType = 'paint' | 'watercolor' | 'charcoal' | 'pen' | 'finger';
type DrawingMode = 'draw' | 'erase' | 'smudge';

// Color therapy system
interface TherapeuticColor {
  name: string;
  hex: string;
  meaning: string;
  energy: 'calming' | 'energizing' | 'grounding' | 'uplifting';
  chakra?: string;
}

// Gesture patterns for emotional expression
interface GesturePattern {
  type: 'circular' | 'linear' | 'chaotic' | 'rhythmic';
  intensity: number;
  emotion: string;
  therapeuticMeaning: string;
}

interface ArtCanvasProps {
  onArtworkComplete?: (artwork: CanvasArtwork) => void;
  width?: number;
  height?: number;
  className?: string;
}

interface CanvasArtwork {
  id: string;
  imageData: string; // base64
  strokes: StrokeData[];
  colors: string[];
  gestureAnalysis: GesturePattern[];
  mood?: MoodType;
  reflectionPrompt?: string;
  timestamp: Date;
  therapeuticInsights?: string[];
}

interface StrokeData {
  points: { x: number; y: number; pressure?: number }[];
  color: string;
  brushType: BrushType;
  size: number;
  timestamp: number;
}

// Therapeutic color palette inspired by sage green
const THERAPEUTIC_COLORS: TherapeuticColor[] = [
  {
    name: 'Sage Sanctuary',
    hex: '#a4b792',
    meaning: 'Peace, balance, renewal',
    energy: 'grounding',
    chakra: 'Heart'
  },
  {
    name: 'Earth Embrace',
    hex: '#cb997e',
    meaning: 'Safety, warmth, connection',
    energy: 'grounding'
  },
  {
    name: 'Tender Blush',
    hex: '#eeddd3',
    meaning: 'Gentleness, self-compassion',
    energy: 'calming'
  },
  {
    name: 'Ocean Depth',
    hex: '#6fa8a6',
    meaning: 'Emotional flow, depth',
    energy: 'calming'
  },
  {
    name: 'Sunrise Hope',
    hex: '#f7d794',
    meaning: 'Optimism, new beginnings',
    energy: 'uplifting'
  },
  {
    name: 'Lavender Rest',
    hex: '#c8a2c8',
    meaning: 'Calm, spiritual connection',
    energy: 'calming'
  },
  {
    name: 'Forest Ground',
    hex: '#8ba078',
    meaning: 'Stability, growth',
    energy: 'grounding'
  },
  {
    name: 'Pure Light',
    hex: '#ffffff',
    meaning: 'Clarity, fresh start',
    energy: 'uplifting'
  },
  {
    name: 'Shadow Depth',
    hex: '#2e2e2e',
    meaning: 'Depth, mystery, strength',
    energy: 'grounding'
  }
];

const ArtCanvas: React.FC<ArtCanvasProps> = ({
  onArtworkComplete,
  width = 800,
  height = 600,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentBrush, setCurrentBrush] = useState<BrushType>('paint');
  const [brushSize, setBrushSize] = useState(20);
  const [selectedColor, setSelectedColor] = useState(THERAPEUTIC_COLORS[0].hex);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('draw');
  const [opacity, setOpacity] = useState(1);
  
  // Art analysis states
  const [strokes, setStrokes] = useState<StrokeData[]>([]);
  const [gesturePatterns, setGesturePatterns] = useState<GesturePattern[]>([]);
  const [artAnalysis, setArtAnalysis] = useState<string[]>([]);
  const [showColorMeanings, setShowColorMeanings] = useState(false);
  
  const { currentMood, getMoodData } = useMoodContext();

  // Current stroke tracking
  const currentStrokeRef = useRef<StrokeData | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Memoized brush configurations
  const brushConfigs = useMemo(() => ({
    paint: { 
      lineCap: 'round' as CanvasLineCap, 
      lineJoin: 'round' as CanvasLineJoin,
      globalCompositeOperation: 'source-over' as GlobalCompositeOperation,
      filter: 'none'
    },
    watercolor: { 
      lineCap: 'round' as CanvasLineCap, 
      lineJoin: 'round' as CanvasLineJoin,
      globalCompositeOperation: 'multiply' as GlobalCompositeOperation,
      filter: 'blur(1px)'
    },
    charcoal: { 
      lineCap: 'square' as CanvasLineCap, 
      lineJoin: 'miter' as CanvasLineJoin,
      globalCompositeOperation: 'source-over' as GlobalCompositeOperation,
      filter: 'blur(0.5px)'
    },
    pen: { 
      lineCap: 'butt' as CanvasLineCap, 
      lineJoin: 'miter' as CanvasLineJoin,
      globalCompositeOperation: 'source-over' as GlobalCompositeOperation,
      filter: 'none'
    },
    finger: { 
      lineCap: 'round' as CanvasLineCap, 
      lineJoin: 'round' as CanvasLineJoin,
      globalCompositeOperation: 'source-over' as GlobalCompositeOperation,
      filter: 'blur(2px)'
    }
  }), []);

  // Get canvas context with brush settings
  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    const config = brushConfigs[currentBrush];
    
    ctx.lineCap = config.lineCap;
    ctx.lineJoin = config.lineJoin;
    ctx.globalCompositeOperation = drawingMode === 'erase' ? 'destination-out' : config.globalCompositeOperation;
    ctx.globalAlpha = opacity;
    ctx.filter = config.filter;
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = drawingMode === 'erase' ? 'rgba(0,0,0,1)' : selectedColor;
    
    return ctx;
  }, [currentBrush, brushSize, selectedColor, opacity, drawingMode, brushConfigs]);

  // Get canvas coordinates from event
  const getCanvasCoordinates = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    
    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      return { x: 0, y: 0 };
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }, []);

  // Analyze gesture patterns
  const analyzeGesture = useCallback((stroke: StrokeData): GesturePattern => {
    const points = stroke.points;
    if (points.length < 3) {
      return {
        type: 'linear',
        intensity: 0.1,
        emotion: 'tentative',
        therapeuticMeaning: 'Gentle exploration, testing boundaries'
      };
    }
    
    // Calculate movement characteristics
    let totalDistance = 0;
    let totalAngleChange = 0;
    let circularMotion = 0;
    
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i-1].x;
      const dy = points[i].y - points[i-1].y;
      totalDistance += Math.sqrt(dx * dx + dy * dy);
      
      if (i > 1) {
        const angle1 = Math.atan2(points[i-1].y - points[i-2].y, points[i-1].x - points[i-2].x);
        const angle2 = Math.atan2(points[i].y - points[i-1].y, points[i].x - points[i-1].x);
        let angleDiff = angle2 - angle1;
        
        // Normalize angle difference
        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
        
        totalAngleChange += Math.abs(angleDiff);
        circularMotion += angleDiff;
      }
    }
    
    const avgAngleChange = totalAngleChange / (points.length - 2);
    const intensity = Math.min(1, totalDistance / 500);
    const isCircular = Math.abs(circularMotion) > Math.PI;
    const isChaotic = avgAngleChange > 1;
    
    // Determine pattern type and meaning
    if (isCircular) {
      return {
        type: 'circular',
        intensity,
        emotion: intensity > 0.7 ? 'energetic' : 'contemplative',
        therapeuticMeaning: 'Processing, integration, wholeness-seeking'
      };
    } else if (isChaotic) {
      return {
        type: 'chaotic',
        intensity,
        emotion: intensity > 0.5 ? 'overwhelming' : 'scattered',
        therapeuticMeaning: 'Emotional release, breaking patterns, transformation'
      };
    } else if (intensity > 0.6) {
      return {
        type: 'rhythmic',
        intensity,
        emotion: 'expressive',
        therapeuticMeaning: 'Emotional rhythm, finding flow, self-expression'
      };
    } else {
      return {
        type: 'linear',
        intensity,
        emotion: 'focused',
        therapeuticMeaning: 'Direct communication, clarity-seeking, purposeful'
      };
    }
  }, []);

  // Start drawing
  const startDrawing = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    
    const coords = getCanvasCoordinates(event);
    setIsDrawing(true);
    lastPointRef.current = coords;
    
    // Start new stroke
    currentStrokeRef.current = {
      points: [coords],
      color: selectedColor,
      brushType: currentBrush,
      size: brushSize,
      timestamp: Date.now()
    };
    
    // Haptic feedback
    if (navigator.vibrate && 'touches' in event) {
      navigator.vibrate(10);
    }
  }, [getCanvasCoordinates, selectedColor, currentBrush, brushSize]);

  // Continue drawing
  const draw = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentStrokeRef.current || !lastPointRef.current) return;
    
    event.preventDefault();
    const ctx = getContext();
    if (!ctx) return;
    
    const coords = getCanvasCoordinates(event);
    const lastPoint = lastPointRef.current;
    
    // Add smoothing for better drawing experience
    const midPoint = {
      x: (lastPoint.x + coords.x) / 2,
      y: (lastPoint.y + coords.y) / 2
    };
    
    // Draw smooth curve
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, midPoint.x, midPoint.y);
    ctx.stroke();
    
    // Update stroke data
    currentStrokeRef.current.points.push(coords);
    lastPointRef.current = coords;
  }, [isDrawing, getContext, getCanvasCoordinates]);

  // End drawing
  const endDrawing = useCallback(() => {
    if (!isDrawing || !currentStrokeRef.current) return;
    
    setIsDrawing(false);
    
    // Analyze the completed stroke
    const gesture = analyzeGesture(currentStrokeRef.current);
    
    setStrokes(prev => [...prev, currentStrokeRef.current!]);
    setGesturePatterns(prev => [...prev, gesture]);
    
    currentStrokeRef.current = null;
    lastPointRef.current = null;
  }, [isDrawing, analyzeGesture]);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
    setGesturePatterns([]);
    setArtAnalysis([]);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50, 100, 50]);
    }
  }, []);

  // Save artwork
  const saveArtwork = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || strokes.length === 0) return;
    
    const imageData = canvas.toDataURL('image/png');
    const usedColors = [...new Set(strokes.map(s => s.color))];
    
    // Generate therapeutic insights based on art analysis
    const insights = [
      ...gesturePatterns.map(g => g.therapeuticMeaning),
      usedColors.length > 5 ? 'Rich color exploration suggests emotional complexity' : 'Focused color use shows emotional clarity',
      currentMood ? `Artistic expression aligns with ${currentMood} energy` : 'Authentic emotional expression through color and form'
    ];
    
    const artwork: CanvasArtwork = {
      id: Date.now().toString(),
      imageData,
      strokes,
      colors: usedColors,
      gestureAnalysis: gesturePatterns,
      mood: currentMood || undefined,
      timestamp: new Date(),
      therapeuticInsights: insights
    };
    
    // Save to localStorage
    const savedArt = JSON.parse(localStorage.getItem('alchm_artwork') || '[]');
    savedArt.push(artwork);
    localStorage.setItem('alchm_artwork', JSON.stringify(savedArt));
    
    onArtworkComplete?.(artwork);
    
    // Success haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  }, [strokes, gesturePatterns, currentMood, onArtworkComplete]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;
    
    // Set background
    ctx.fillStyle = '#fefcfb';
    ctx.fillRect(0, 0, width, height);
  }, [width, height]);

  return (
    <div className={`art-canvas ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Digital Art Therapy
        </h3>
        <p className="text-sm text-gray-600">
          Express what words cannot reach through color and form
        </p>
      </div>

      {/* Canvas Container */}
      <div className="canvas-container bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
        
        {/* Therapeutic Color Palette */}
        <div className="color-palette mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-700">Therapeutic Colors</h4>
            <button
              onClick={() => setShowColorMeanings(!showColorMeanings)}
              className="text-xs text-sage-600 hover:text-sage-800"
            >
              {showColorMeanings ? 'Hide meanings' : 'Show meanings'}
            </button>
          </div>
          
          <div className="grid grid-cols-9 gap-2 mb-4">
            {THERAPEUTIC_COLORS.map((color) => (
              <div key={color.hex} className="relative">
                <button
                  onClick={() => setSelectedColor(color.hex)}
                  className={`
                    w-10 h-10 rounded-xl border-2 transition-all duration-200 
                    ${selectedColor === color.hex 
                      ? 'border-gray-800 scale-110 shadow-md' 
                      : 'border-gray-200 hover:border-gray-400 hover:scale-105'
                    }
                  `}
                  style={{ backgroundColor: color.hex }}
                  title={`${color.name}: ${color.meaning}`}
                />
                
                {showColorMeanings && (
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-10 bg-black text-white text-xs p-2 rounded-lg shadow-lg w-32 text-center">
                    <div className="font-semibold">{color.name}</div>
                    <div className="text-gray-300">{color.meaning}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Brush Tools */}
        <div className="brush-tools flex flex-wrap items-center justify-between mb-6 p-4 bg-sage-50 rounded-2xl">
          
          {/* Brush Types */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 mr-2">Brush:</span>
            {(['paint', 'watercolor', 'charcoal', 'pen', 'finger'] as BrushType[]).map((brush) => (
              <button
                key={brush}
                onClick={() => setCurrentBrush(brush)}
                className={`
                  px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200
                  ${currentBrush === brush 
                    ? 'bg-sage-400 text-white' 
                    : 'bg-white text-gray-600 hover:bg-sage-100'
                  }
                `}
              >
                {brush.charAt(0).toUpperCase() + brush.slice(1)}
              </button>
            ))}
          </div>

          {/* Drawing Modes */}
          <div className="flex items-center gap-2">
            {(['draw', 'erase', 'smudge'] as DrawingMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setDrawingMode(mode)}
                className={`
                  px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200
                  ${drawingMode === mode 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {mode === 'draw' ? '✏️' : mode === 'erase' ? '🧽' : '👆'}
              </button>
            ))}
          </div>
        </div>

        {/* Brush Settings */}
        <div className="brush-settings flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-2xl">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <span>Size:</span>
              <input
                type="range"
                min="2"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-xs text-gray-500">{brushSize}px</span>
            </label>
            
            <label className="flex items-center gap-2 text-sm">
              <span>Opacity:</span>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-xs text-gray-500">{Math.round(opacity * 100)}%</span>
            </label>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={clearCanvas}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
            >
              Clear Canvas
            </button>
            
            <button
              onClick={saveArtwork}
              disabled={strokes.length === 0}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${strokes.length > 0
                  ? 'bg-sage-400 text-white hover:bg-sage-500'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              Save Artwork
            </button>
          </div>
        </div>

        {/* Drawing Canvas */}
        <div className="canvas-wrapper relative border-2 border-sage-200 rounded-2xl overflow-hidden bg-[#fefcfb]">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
            className="block cursor-crosshair touch-none"
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: `${width}px`,
              maxHeight: `${height}px`
            }}
          />
          
          {strokes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">🎨</div>
                <p className="text-sm">Touch the canvas to begin expressing</p>
              </div>
            </div>
          )}
        </div>

        {/* Gesture Analysis */}
        {gesturePatterns.length > 0 && (
          <div className="gesture-analysis mt-6 p-4 bg-gradient-to-br from-sage-50 to-green-50 rounded-2xl">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Expression Analysis</h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {['circular', 'linear', 'chaotic', 'rhythmic'].map((type) => {
                const count = gesturePatterns.filter(g => g.type === type).length;
                return (
                  <div key={type} className="text-center">
                    <div className="text-lg font-semibold text-sage-700">{count}</div>
                    <div className="text-xs text-gray-600 capitalize">{type}</div>
                  </div>
                );
              })}
            </div>
            
            {gesturePatterns.slice(-3).map((pattern, i) => (
              <div key={i} className="text-xs text-gray-600 mb-1">
                <span className="font-medium capitalize">{pattern.type}</span>: {pattern.therapeuticMeaning}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtCanvas;