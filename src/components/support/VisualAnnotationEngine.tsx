'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { 
  MousePointer,
  Square,
  Circle,
  MessageCircle,
  Type,
  Highlighter,
  ArrowRight,
  Undo,
  Redo,
  Download,
  Trash2,
  Heart,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Palette,
  Move,
  Edit3,
  Check,
  X
} from 'lucide-react';

interface VisualAnnotationEngineProps {
  imageUrl: string;
  originalImage?: HTMLImageElement;
  onAnnotationsChange?: (annotations: Annotation[]) => void;
  onSolutionGenerated?: (solution: AnnotatedSolution) => void;
  traumaInformed?: boolean;
  readOnly?: boolean;
}

interface Annotation {
  id: string;
  type: AnnotationType;
  bounds: Rectangle;
  style: AnnotationStyle;
  content?: AnnotationContent;
  timestamp: Date;
  traumaInformed: TraumaInformedAnnotation;
  order?: number;
  interactive: boolean;
  linkedAnnotations?: string[];
}

type AnnotationType = 
  | 'highlight'
  | 'circle'
  | 'rectangle' 
  | 'arrow'
  | 'text'
  | 'problem'
  | 'solution'
  | 'gentle_guidance'
  | 'celebration'
  | 'instruction'
  | 'warning'
  | 'support';

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AnnotationStyle {
  stroke: string;
  strokeWidth: number;
  fill?: string;
  opacity: number;
  animation?: AnimationType;
  therapeutic: TherapeuticStyle;
}

interface TherapeuticStyle {
  gentleGlow: boolean;
  heartSparkles: boolean;
  softPulse: boolean;
  calmingColor: boolean;
  supportiveIcon?: string;
}

type AnimationType = 
  | 'none'
  | 'gentle_pulse'
  | 'soft_glow'
  | 'heart_sparkle'
  | 'gentle_bounce'
  | 'breathing'
  | 'encouraging_wave';

interface AnnotationContent {
  text: string;
  fontSize: number;
  fontFamily: string;
  textColor: string;
  backgroundColor?: string;
  traumaInformedText: string;
  supportLevel: 'minimal' | 'moderate' | 'intensive';
  encouragement?: string;
}

interface TraumaInformedAnnotation {
  supportiveMessage: string;
  encouragement: string;
  gentleLanguage: string;
  emotionalTone: 'calm' | 'encouraging' | 'understanding' | 'celebrating';
  pacing: 'no_pressure' | 'gentle' | 'step_by_step';
  safetyCheck: boolean;
}

interface AnnotatedSolution {
  id: string;
  title: string;
  description: string;
  traumaInformedDescription: string;
  annotations: Annotation[];
  steps: SolutionStep[];
  beforeImage: string;
  afterImage: string;
  confidence: number;
  estimatedTime: number;
  difficultyLevel: 'easy' | 'medium' | 'advanced';
  supportLevel: 'self_guided' | 'assisted' | 'guided';
}

interface SolutionStep {
  id: string;
  order: number;
  title: string;
  description: string;
  traumaInformedDescription: string;
  annotation: Annotation;
  action: 'click' | 'type' | 'scroll' | 'wait' | 'observe';
  encouragement: string;
  timeEstimate: number;
}

interface DrawingState {
  isDrawing: boolean;
  currentTool: AnnotationType;
  startPoint?: { x: number; y: number };
  currentAnnotation?: Annotation;
  selectedAnnotation?: string;
  editingText?: string;
}

export function VisualAnnotationEngine({
  imageUrl,
  originalImage,
  onAnnotationsChange,
  onSolutionGenerated,
  traumaInformed = true,
  readOnly = false
}: VisualAnnotationEngineProps) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    currentTool: 'gentle_guidance'
  });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<Annotation[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('#10b981'); // Sage green default
  const [showSolutionPreview, setShowSolutionPreview] = useState(false);
  const [generatedSolution, setGeneratedSolution] = useState<AnnotatedSolution | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load image
  useEffect(() => {
    if (imageRef.current && imageUrl) {
      imageRef.current.src = imageUrl;
    }
  }, [imageUrl]);

  // Save to history when annotations change
  useEffect(() => {
    if (annotations.length > 0) {
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push([...annotations]);
        return newHistory.slice(-50); // Keep last 50 states
      });
      setHistoryIndex(prev => prev + 1);
    }
    
    onAnnotationsChange?.(annotations);
  }, [annotations, onAnnotationsChange]);

  const createAnnotation = useCallback((
    type: AnnotationType,
    bounds: Rectangle,
    content?: Partial<AnnotationContent>
  ): Annotation => {
    const baseStyles: Record<AnnotationType, AnnotationStyle> = {
      highlight: {
        stroke: currentColor,
        strokeWidth: 0,
        fill: currentColor,
        opacity: 0.3,
        therapeutic: { gentleGlow: true, heartSparkles: false, softPulse: false, calmingColor: true }
      },
      circle: {
        stroke: currentColor,
        strokeWidth: 3,
        opacity: 0.8,
        animation: 'gentle_pulse',
        therapeutic: { gentleGlow: true, heartSparkles: false, softPulse: true, calmingColor: true }
      },
      rectangle: {
        stroke: currentColor,
        strokeWidth: 2,
        opacity: 0.8,
        therapeutic: { gentleGlow: true, heartSparkles: false, softPulse: false, calmingColor: true }
      },
      arrow: {
        stroke: currentColor,
        strokeWidth: 3,
        opacity: 0.9,
        animation: 'gentle_bounce',
        therapeutic: { gentleGlow: true, heartSparkles: false, softPulse: false, calmingColor: true }
      },
      text: {
        stroke: '#1f2937',
        strokeWidth: 0,
        fill: '#1f2937',
        opacity: 1,
        therapeutic: { gentleGlow: false, heartSparkles: false, softPulse: false, calmingColor: true }
      },
      problem: {
        stroke: '#ef4444',
        strokeWidth: 2,
        fill: '#fef2f2',
        opacity: 0.7,
        therapeutic: { gentleGlow: true, heartSparkles: false, softPulse: false, calmingColor: false, supportiveIcon: '⚠️' }
      },
      solution: {
        stroke: '#10b981',
        strokeWidth: 2,
        fill: '#f0fdf4',
        opacity: 0.7,
        animation: 'soft_glow',
        therapeutic: { gentleGlow: true, heartSparkles: true, softPulse: false, calmingColor: true, supportiveIcon: '✨' }
      },
      gentle_guidance: {
        stroke: '#8b5cf6',
        strokeWidth: 2,
        fill: '#faf5ff',
        opacity: 0.8,
        animation: 'breathing',
        therapeutic: { gentleGlow: true, heartSparkles: true, softPulse: true, calmingColor: true, supportiveIcon: '💜' }
      },
      celebration: {
        stroke: '#f59e0b',
        strokeWidth: 3,
        fill: '#fffbeb',
        opacity: 0.8,
        animation: 'heart_sparkle',
        therapeutic: { gentleGlow: true, heartSparkles: true, softPulse: false, calmingColor: true, supportiveIcon: '🎉' }
      },
      instruction: {
        stroke: '#3b82f6',
        strokeWidth: 2,
        fill: '#eff6ff',
        opacity: 0.7,
        therapeutic: { gentleGlow: true, heartSparkles: false, softPulse: false, calmingColor: true, supportiveIcon: '👆' }
      },
      warning: {
        stroke: '#f59e0b',
        strokeWidth: 2,
        fill: '#fffbeb',
        opacity: 0.7,
        therapeutic: { gentleGlow: true, heartSparkles: false, softPulse: true, calmingColor: true, supportiveIcon: '💛' }
      },
      support: {
        stroke: '#10b981',
        strokeWidth: 2,
        fill: '#f0fdf4',
        opacity: 0.8,
        animation: 'encouraging_wave',
        therapeutic: { gentleGlow: true, heartSparkles: true, softPulse: true, calmingColor: true, supportiveIcon: '💚' }
      }
    };

    const traumaInformedMessages: Record<AnnotationType, TraumaInformedAnnotation> = {
      highlight: {
        supportiveMessage: "We're gently highlighting this area to help guide your attention",
        encouragement: "Take your time looking at this - there's no rush",
        gentleLanguage: "Let's focus on this area together",
        emotionalTone: 'calm',
        pacing: 'gentle',
        safetyCheck: true
      },
      circle: {
        supportiveMessage: "This circle shows something important, but you're in control",
        encouragement: "You're doing great by paying attention to the details",
        gentleLanguage: "This area needs our gentle attention",
        emotionalTone: 'encouraging',
        pacing: 'no_pressure',
        safetyCheck: true
      },
      gentle_guidance: {
        supportiveMessage: "We're here to guide you through this step with care",
        encouragement: "Every step you take is progress, no matter how small",
        gentleLanguage: "Let's walk through this together, one breath at a time",
        emotionalTone: 'understanding',
        pacing: 'step_by_step',
        safetyCheck: true
      },
      solution: {
        supportiveMessage: "Here's a gentle solution that will help make things better",
        encouragement: "You're so close to solving this - you're doing amazingly",
        gentleLanguage: "This solution is designed to be easy and stress-free",
        emotionalTone: 'celebrating',
        pacing: 'gentle',
        safetyCheck: true
      },
      celebration: {
        supportiveMessage: "Celebrate this moment - you've accomplished something wonderful",
        encouragement: "Your success matters and deserves recognition",
        gentleLanguage: "Take a moment to appreciate what you've achieved",
        emotionalTone: 'celebrating',
        pacing: 'no_pressure',
        safetyCheck: true
      },
      // ... add more trauma-informed messages for other types
      rectangle: {
        supportiveMessage: "This highlighted area contains helpful information",
        encouragement: "You're being so thoughtful by examining this carefully",
        gentleLanguage: "Let's look at this section with gentle curiosity",
        emotionalTone: 'calm',
        pacing: 'gentle',
        safetyCheck: true
      },
      arrow: {
        supportiveMessage: "This arrow is pointing toward something that can help you",
        encouragement: "Following directions is a strength - you're doing well",
        gentleLanguage: "Let's gently follow this guidance together",
        emotionalTone: 'encouraging',
        pacing: 'step_by_step',
        safetyCheck: true
      },
      text: {
        supportiveMessage: "This message is here to support and guide you",
        encouragement: "Reading and understanding shows your commitment to growth",
        gentleLanguage: "These words are chosen carefully to support you",
        emotionalTone: 'understanding',
        pacing: 'no_pressure',
        safetyCheck: true
      },
      problem: {
        supportiveMessage: "We've identified an issue, but remember - this isn't your fault",
        encouragement: "Recognizing problems is the first step toward healing",
        gentleLanguage: "This challenge is something we can work through together",
        emotionalTone: 'understanding',
        pacing: 'gentle',
        safetyCheck: true
      },
      instruction: {
        supportiveMessage: "Here's a gentle instruction to help guide your next step",
        encouragement: "You have the capability to follow this guidance successfully",
        gentleLanguage: "This instruction is designed to be clear and supportive",
        emotionalTone: 'encouraging',
        pacing: 'step_by_step',
        safetyCheck: true
      },
      warning: {
        supportiveMessage: "This gentle reminder helps keep you safe and informed",
        encouragement: "Being cautious shows wisdom and self-care",
        gentleLanguage: "Let's proceed mindfully with this gentle warning in mind",
        emotionalTone: 'calm',
        pacing: 'gentle',
        safetyCheck: true
      },
      support: {
        supportiveMessage: "This represents the support that's always available to you",
        encouragement: "Seeking support is a sign of strength and self-awareness",
        gentleLanguage: "You are never alone in this journey",
        emotionalTone: 'understanding',
        pacing: 'no_pressure',
        safetyCheck: true
      }
    };

    return {
      id: `annotation-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      type,
      bounds,
      style: baseStyles[type],
      content: content ? {
        text: content.text || '',
        fontSize: content.fontSize || 14,
        fontFamily: content.fontFamily || 'system-ui',
        textColor: content.textColor || '#1f2937',
        backgroundColor: content.backgroundColor,
        traumaInformedText: content.traumaInformedText || '',
        supportLevel: content.supportLevel || 'moderate',
        encouragement: content.encouragement
      } : undefined,
      timestamp: new Date(),
      traumaInformed: traumaInformedMessages[type],
      interactive: !readOnly,
      order: annotations.length + 1
    };
  }, [currentColor, annotations.length, readOnly]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale - offset.x;
    const y = (e.clientY - rect.top) / scale - offset.y;
    
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      startPoint: { x, y }
    }));
  }, [readOnly, scale, offset]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingState.isDrawing || !drawingState.startPoint || readOnly) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale - offset.x;
    const y = (e.clientY - rect.top) / scale - offset.y;
    
    const bounds: Rectangle = {
      x: Math.min(drawingState.startPoint.x, x),
      y: Math.min(drawingState.startPoint.y, y),
      width: Math.abs(x - drawingState.startPoint.x),
      height: Math.abs(y - drawingState.startPoint.y)
    };
    
    // Create preview annotation
    const previewAnnotation = createAnnotation(drawingState.currentTool, bounds);
    setDrawingState(prev => ({ ...prev, currentAnnotation: previewAnnotation }));
  }, [drawingState.isDrawing, drawingState.startPoint, drawingState.currentTool, readOnly, scale, offset, createAnnotation]);

  const handleCanvasMouseUp = useCallback(() => {
    if (!drawingState.isDrawing || !drawingState.currentAnnotation || readOnly) return;
    
    // Add the annotation if it's large enough
    if (drawingState.currentAnnotation.bounds.width > 10 || drawingState.currentAnnotation.bounds.height > 10) {
      setAnnotations(prev => [...prev, drawingState.currentAnnotation!]);
    }
    
    setDrawingState(prev => ({
      ...prev,
      isDrawing: false,
      startPoint: undefined,
      currentAnnotation: undefined
    }));
  }, [drawingState.isDrawing, drawingState.currentAnnotation, readOnly]);

  const generateSolution = useCallback(async () => {
    if (annotations.length === 0) return;
    
    // Simulate AI-powered solution generation
    const solution: AnnotatedSolution = {
      id: `solution-${Date.now()}`,
      title: traumaInformed ? 'Gentle Step-by-Step Solution' : 'Solution Guide',
      description: 'Based on your annotations, here\'s a personalized solution',
      traumaInformedDescription: 'We\'ve created a gentle, step-by-step guide just for you. Take your time with each step, and remember - you\'re in control.',
      annotations,
      steps: annotations.map((annotation, index) => ({
        id: `step-${index + 1}`,
        order: index + 1,
        title: `Step ${index + 1}`,
        description: annotation.content?.text || `Interact with the ${annotation.type} area`,
        traumaInformedDescription: annotation.traumaInformed.gentleLanguage,
        annotation,
        action: 'click',
        encouragement: annotation.traumaInformed.encouragement,
        timeEstimate: 30
      })),
      beforeImage: imageUrl,
      afterImage: imageUrl, // Would be generated
      confidence: 0.85,
      estimatedTime: annotations.length * 2, // 2 minutes per step
      difficultyLevel: 'easy',
      supportLevel: traumaInformed ? 'guided' : 'self_guided'
    };
    
    setGeneratedSolution(solution);
    setShowSolutionPreview(true);
    onSolutionGenerated?.(solution);
  }, [annotations, imageUrl, traumaInformed, onSolutionGenerated]);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image || !image.complete) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(offset.x, offset.y);
    ctx.drawImage(image, 0, 0);
    
    // Draw annotations
    [...annotations, drawingState.currentAnnotation].filter(Boolean).forEach(annotation => {
      if (!annotation) return;
      
      const { bounds, style, type, content } = annotation;
      
      // Set style
      ctx.strokeStyle = style.stroke;
      ctx.lineWidth = style.strokeWidth;
      ctx.globalAlpha = style.opacity;
      
      if (style.fill) {
        ctx.fillStyle = style.fill;
      }
      
      // Draw based on type
      switch (type) {
        case 'rectangle':
        case 'highlight':
        case 'problem':
        case 'solution':
        case 'gentle_guidance':
        case 'celebration':
        case 'instruction':
        case 'warning':
        case 'support':
          if (style.fill) {
            ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
          }
          if (style.strokeWidth > 0) {
            ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
          }
          break;
          
        case 'circle':
          const centerX = bounds.x + bounds.width / 2;
          const centerY = bounds.y + bounds.height / 2;
          const radius = Math.min(bounds.width, bounds.height) / 2;
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          if (style.fill) {
            ctx.fill();
          }
          if (style.strokeWidth > 0) {
            ctx.stroke();
          }
          break;
          
        case 'arrow':
          const startX = bounds.x;
          const startY = bounds.y;
          const endX = bounds.x + bounds.width;
          const endY = bounds.y + bounds.height;
          
          // Draw arrow line
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          
          // Draw arrowhead
          const angle = Math.atan2(endY - startY, endX - startX);
          const arrowLength = 15;
          
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - arrowLength * Math.cos(angle - Math.PI / 6),
            endY - arrowLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - arrowLength * Math.cos(angle + Math.PI / 6),
            endY - arrowLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
          break;
          
        case 'text':
          if (content?.text) {
            ctx.font = `${content.fontSize}px ${content.fontFamily}`;
            ctx.fillStyle = content.textColor;
            ctx.globalAlpha = 1;
            
            if (content.backgroundColor) {
              const textMetrics = ctx.measureText(content.text);
              ctx.fillStyle = content.backgroundColor;
              ctx.fillRect(
                bounds.x - 4,
                bounds.y - content.fontSize - 4,
                textMetrics.width + 8,
                content.fontSize + 8
              );
              ctx.fillStyle = content.textColor;
            }
            
            ctx.fillText(content.text, bounds.x, bounds.y);
          }
          break;
      }
      
      // Draw therapeutic elements
      if (style.therapeutic.supportiveIcon) {
        ctx.globalAlpha = 1;
        ctx.font = '16px system-ui';
        ctx.fillStyle = style.stroke;
        ctx.fillText(
          style.therapeutic.supportiveIcon,
          bounds.x + bounds.width + 5,
          bounds.y + 20
        );
      }
    });
    
    ctx.restore();
  }, [annotations, drawingState.currentAnnotation, scale, offset]);

  // Render canvas when dependencies change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const ToolButton = ({ tool, icon: Icon, label }: { 
    tool: AnnotationType; 
    icon: React.ComponentType<any>; 
    label: string; 
  }) => (
    <Button
      variant={drawingState.currentTool === tool ? 'default' : 'ghost'}
      size="sm"
      onClick={() => setDrawingState(prev => ({ ...prev, currentTool: tool }))}
      className={`flex items-center gap-2 ${
        drawingState.currentTool === tool 
          ? 'bg-sage-400 text-white' 
          : 'hover:bg-sage-50'
      }`}
      disabled={readOnly}
    >
      <Icon className="w-4 h-4" />
      <span className="text-xs">{label}</span>
    </Button>
  );

  return (
    <div className="space-y-6">
      {/* Tool Palette */}
      {!readOnly && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Edit3 className="w-6 h-6 text-sage-600" />
              <h3 className="text-lg font-semibold text-sanctuary-gray-800">
                {traumaInformed ? 'Gentle Annotation Tools' : 'Annotation Tools'}
              </h3>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {/* Trauma-Informed Tools */}
              {traumaInformed && (
                <div>
                  <h4 className="text-sm font-medium text-sanctuary-gray-700 mb-2">
                    💚 Supportive Tools
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <ToolButton tool="gentle_guidance" icon={Heart} label="Gentle Guide" />
                    <ToolButton tool="support" icon={Sparkles} label="Support" />
                    <ToolButton tool="celebration" icon={Check} label="Celebrate" />
                  </div>
                </div>
              )}
              
              {/* Standard Tools */}
              <div>
                <h4 className="text-sm font-medium text-sanctuary-gray-700 mb-2">
                  Drawing Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  <ToolButton tool="highlight" icon={Highlighter} label="Highlight" />
                  <ToolButton tool="circle" icon={Circle} label="Circle" />
                  <ToolButton tool="rectangle" icon={Square} label="Rectangle" />
                  <ToolButton tool="arrow" icon={ArrowRight} label="Arrow" />
                  <ToolButton tool="text" icon={Type} label="Text" />
                </div>
              </div>
              
              {/* Problem/Solution Tools */}
              <div>
                <h4 className="text-sm font-medium text-sanctuary-gray-700 mb-2">
                  Solution Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  <ToolButton tool="problem" icon={X} label="Problem" />
                  <ToolButton tool="solution" icon={Check} label="Solution" />
                  <ToolButton tool="instruction" icon={MousePointer} label="Instruction" />
                  <ToolButton tool="warning" icon={AlertTriangle} label="Warning" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Canvas Area */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-sanctuary-gray-800">
              {traumaInformed ? 'Your Annotated Guide' : 'Annotated Screenshot'}
            </h3>
            
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 border rounded p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setScale(prev => Math.max(0.25, prev - 0.25))}
                >
                  <ZoomOut className="w-3 h-3" />
                </Button>
                <span className="text-xs px-2">{Math.round(scale * 100)}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setScale(prev => Math.min(3, prev + 0.25))}
                >
                  <ZoomIn className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setScale(1)}
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
              
              {/* History Controls */}
              {!readOnly && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (historyIndex > 0) {
                        setHistoryIndex(prev => prev - 1);
                        setAnnotations(history[historyIndex - 1] || []);
                      }
                    }}
                    disabled={historyIndex <= 0}
                  >
                    <Undo className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (historyIndex < history.length - 1) {
                        setHistoryIndex(prev => prev + 1);
                        setAnnotations(history[historyIndex + 1] || []);
                      }
                    }}
                    disabled={historyIndex >= history.length - 1}
                  >
                    <Redo className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {annotations.length > 0 && (
                  <Button
                    onClick={generateSolution}
                    size="sm"
                    className="bg-sage-400 hover:bg-sage-500 text-white"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    {traumaInformed ? 'Create Guide' : 'Generate Solution'}
                  </Button>
                )}
                
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAnnotations([])}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div ref={containerRef} className="relative overflow-auto max-h-[600px] bg-sanctuary-gray-50">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Screenshot for annotation"
              className="hidden"
              onLoad={renderCanvas}
            />
            
            <canvas
              ref={canvasRef}
              width={imageRef.current?.naturalWidth || 800}
              height={imageRef.current?.naturalHeight || 600}
              className="block cursor-crosshair"
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
            />
          </div>
          
          {annotations.length > 0 && (
            <div className="p-4 border-t bg-sanctuary-gray-50">
              <div className="text-sm text-sanctuary-gray-600">
                {annotations.length} annotation{annotations.length !== 1 ? 's' : ''} created
                {traumaInformed && (
                  <span className="ml-2 text-sage-600">
                    💚 Each annotation is designed to support your journey
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Annotation List */}
      {annotations.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-sanctuary-gray-800">
              {traumaInformed ? 'Your Supportive Annotations' : 'Annotation Details'}
            </h3>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {annotations.map((annotation, index) => (
                <div
                  key={annotation.id}
                  className="p-3 border rounded-lg hover:bg-sanctuary-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-4 h-4 rounded border-2 flex-shrink-0 mt-1"
                      style={{
                        borderColor: annotation.style.stroke,
                        backgroundColor: annotation.style.fill || 'transparent'
                      }}
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-sanctuary-gray-800 capitalize">
                          {annotation.type.replace('_', ' ')}
                        </span>
                        {annotation.style.therapeutic.supportiveIcon && (
                          <span className="text-sm">{annotation.style.therapeutic.supportiveIcon}</span>
                        )}
                        <span className="text-xs text-sanctuary-gray-500">
                          #{index + 1}
                        </span>
                      </div>
                      
                      {traumaInformed && (
                        <p className="text-sm text-sage-700 mb-2">
                          💚 {annotation.traumaInformed.supportiveMessage}
                        </p>
                      )}
                      
                      {annotation.content?.text && (
                        <p className="text-sm text-sanctuary-gray-700 mb-2">
                          "{annotation.content.text}"
                        </p>
                      )}
                      
                      <div className="text-xs text-sanctuary-gray-500">
                        Created: {annotation.timestamp.toLocaleTimeString()}
                        {annotation.traumaInformed.emotionalTone && (
                          <span className="ml-2">
                            Tone: {annotation.traumaInformed.emotionalTone}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {!readOnly && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAnnotations(prev => prev.filter(a => a.id !== annotation.id));
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Solution Preview */}
      {showSolutionPreview && generatedSolution && (
        <Card className="border-sage-200 bg-sage-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-sage-600" />
              <div>
                <h3 className="text-lg font-semibold text-sanctuary-gray-800">
                  {generatedSolution.title}
                </h3>
                <p className="text-sm text-sanctuary-gray-600">
                  Confidence: {Math.round(generatedSolution.confidence * 100)}% • 
                  Estimated time: {generatedSolution.estimatedTime} minutes
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-sanctuary-gray-700 mb-4">
              {traumaInformed 
                ? generatedSolution.traumaInformedDescription 
                : generatedSolution.description}
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sanctuary-gray-800">
                {traumaInformed ? 'Gentle Steps:' : 'Solution Steps:'}
              </h4>
              {generatedSolution.steps.map((step) => (
                <div key={step.id} className="flex items-start gap-3 p-2 bg-white rounded">
                  <div className="w-6 h-6 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center text-xs font-bold">
                    {step.order}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-sanctuary-gray-800">
                      {step.title}
                    </p>
                    <p className="text-sm text-sanctuary-gray-600">
                      {traumaInformed ? step.traumaInformedDescription : step.description}
                    </p>
                    {traumaInformed && step.encouragement && (
                      <p className="text-xs text-sage-600 mt-1 italic">
                        💚 {step.encouragement}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setShowSolutionPreview(false)}
            >
              Close Preview
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  // Download solution as PDF or image
                  console.log('Download solution');
                }}
              >
                <Download className="w-4 h-4 mr-1" />
                Download Guide
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}