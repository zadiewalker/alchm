'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Play, Pause, Download, Eye, EyeOff } from 'lucide-react';

interface AnnotatedScreenshotProps {
  src: string;
  alt: string;
  annotations: VisualAnnotation[];
  beforeAfter?: {
    before: string;
    after: string;
    beforeAlt: string;
    afterAlt: string;
  };
  interactive?: boolean;
  traumaInformed?: boolean;
  onAnnotationClick?: (annotation: VisualAnnotation) => void;
}

interface VisualAnnotation {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  description?: string;
  type: 'click' | 'highlight' | 'warning' | 'info' | 'success' | 'gentle';
  order?: number;
  traumaInformedLabel?: string;
  traumaInformedDescription?: string;
}

interface VideoGuideProps {
  src: string;
  poster?: string;
  annotations?: TimecodedAnnotation[];
  captions?: string;
  traumaInformed?: boolean;
  autoplay?: boolean;
}

interface TimecodedAnnotation {
  timestamp: number;
  annotation: VisualAnnotation;
  duration: number;
}

interface InteractiveWalkthroughProps {
  steps: WalkthroughStep[];
  traumaInformed?: boolean;
  onComplete?: () => void;
}

interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  traumaInformedDescription?: string;
  screenshot: string;
  annotations: VisualAnnotation[];
  nextAction?: 'click' | 'wait' | 'input' | 'observe';
  encouragement?: string;
}

interface BeforeAfterComparisonProps {
  before: {
    src: string;
    alt: string;
    title: string;
    description: string;
  };
  after: {
    src: string;
    alt: string;
    title: string;
    description: string;
  };
  traumaInformed?: boolean;
  splitDirection?: 'horizontal' | 'vertical';
}

export function AnnotatedScreenshot({
  src,
  alt,
  annotations,
  beforeAfter,
  interactive = true,
  traumaInformed = true,
  onAnnotationClick
}: AnnotatedScreenshotProps) {
  const [scale, setScale] = useState(1);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);
  const [showBefore, setShowBefore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleReset = () => setScale(1);

  const getAnnotationStyles = (type: string) => {
    const baseStyles = "absolute border-2 rounded transition-all duration-200 cursor-pointer";
    
    switch (type) {
      case 'click':
        return `${baseStyles} border-blue-400 bg-blue-100/70 hover:bg-blue-200/80`;
      case 'highlight':
        return `${baseStyles} border-yellow-400 bg-yellow-100/70 hover:bg-yellow-200/80`;
      case 'warning':
        return `${baseStyles} border-red-400 bg-red-100/70 hover:bg-red-200/80`;
      case 'success':
        return `${baseStyles} border-green-400 bg-green-100/70 hover:bg-green-200/80`;
      case 'gentle':
        return `${baseStyles} border-sage-400 bg-sage-100/70 hover:bg-sage-200/80`;
      default:
        return `${baseStyles} border-gray-400 bg-gray-100/70 hover:bg-gray-200/80`;
    }
  };

  const getLabelStyles = (type: string) => {
    const baseStyles = "px-2 py-1 text-xs rounded shadow-lg font-medium";
    
    switch (type) {
      case 'click':
        return `${baseStyles} bg-blue-600 text-white`;
      case 'highlight':
        return `${baseStyles} bg-yellow-600 text-white`;
      case 'warning':
        return `${baseStyles} bg-red-600 text-white`;
      case 'success':
        return `${baseStyles} bg-green-600 text-white`;
      case 'gentle':
        return `${baseStyles} bg-sage-600 text-white`;
      default:
        return `${baseStyles} bg-gray-600 text-white`;
    }
  };

  const currentSrc = beforeAfter ? (showBefore ? beforeAfter.before : beforeAfter.after) : src;
  const currentAlt = beforeAfter ? (showBefore ? beforeAfter.beforeAlt : beforeAfter.afterAlt) : alt;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🖼️</span>
            <h4 className="font-medium text-sanctuary-gray-800">
              {traumaInformed ? 'Visual Guide' : 'Screenshot Guide'}
            </h4>
          </div>
          
          {interactive && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAnnotations(!showAnnotations)}
                className="text-sage-600 hover:text-sage-700"
              >
                {showAnnotations ? <EyeOff size={16} /> : <Eye size={16} />}
                {showAnnotations ? 'Hide' : 'Show'} Guide
              </Button>
              
              {beforeAfter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBefore(!showBefore)}
                  className="text-sage-600 hover:text-sage-700"
                >
                  Show {showBefore ? 'After' : 'Before'}
                </Button>
              )}
            </div>
          )}
        </div>
        
        {beforeAfter && (
          <div className="flex gap-4 text-sm">
            <div className={`px-3 py-1 rounded ${showBefore ? 'bg-sage-100 text-sage-700' : 'text-sanctuary-gray-500'}`}>
              Before: Issue present
            </div>
            <div className={`px-3 py-1 rounded ${!showBefore ? 'bg-green-100 text-green-700' : 'text-sanctuary-gray-500'}`}>
              After: Issue resolved
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div 
          ref={containerRef}
          className="relative overflow-auto max-h-96 bg-sanctuary-gray-50"
          style={{
            cursor: scale > 1 ? 'grab' : 'default'
          }}
        >
          <div
            className="relative inline-block min-w-full"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              transition: 'transform 0.2s ease'
            }}
          >
            <img
              src={currentSrc}
              alt={currentAlt}
              className="w-full h-auto block"
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder-screenshot.svg';
              }}
            />
            
            {/* Annotations */}
            {showAnnotations && annotations.map((annotation, index) => (
              <div key={annotation.id} className="absolute">
                {/* Annotation Box */}
                <div
                  className={getAnnotationStyles(annotation.type)}
                  style={{
                    left: `${annotation.x}px`,
                    top: `${annotation.y}px`,
                    width: `${annotation.width}px`,
                    height: `${annotation.height}px`,
                    zIndex: activeAnnotation === annotation.id ? 20 : 10
                  }}
                  onClick={() => {
                    setActiveAnnotation(annotation.id);
                    onAnnotationClick?.(annotation);
                  }}
                  onMouseEnter={() => setActiveAnnotation(annotation.id)}
                  onMouseLeave={() => setActiveAnnotation(null)}
                >
                  {/* Step Number */}
                  {annotation.order && (
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-white border-2 border-current rounded-full flex items-center justify-center text-xs font-medium">
                      {annotation.order}
                    </div>
                  )}
                </div>
                
                {/* Label */}
                <div
                  className={`absolute ${getLabelStyles(annotation.type)} max-w-xs z-30 ${
                    activeAnnotation === annotation.id ? 'block' : 'hidden'
                  }`}
                  style={{
                    left: `${annotation.x}px`,
                    top: `${annotation.y - 35}px`
                  }}
                >
                  <div className="font-medium">
                    {traumaInformed && annotation.traumaInformedLabel 
                      ? annotation.traumaInformedLabel 
                      : annotation.label
                    }
                  </div>
                  {annotation.description && (
                    <div className="text-xs mt-1 opacity-90">
                      {traumaInformed && annotation.traumaInformedDescription
                        ? annotation.traumaInformedDescription
                        : annotation.description
                      }
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Controls */}
        {interactive && (
          <div className="flex items-center justify-between p-3 bg-sanctuary-gray-50 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
              >
                <ZoomOut size={16} />
              </Button>
              <span className="text-sm text-sanctuary-gray-600 min-w-12 text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={scale >= 3}
              >
                <ZoomIn size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="ml-2"
              >
                <RotateCcw size={16} />
              </Button>
            </div>
            
            <div className="text-xs text-sanctuary-gray-500">
              {traumaInformed ? 'Take your time exploring this guide' : 'Click annotations for details'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function VideoGuide({
  src,
  poster,
  annotations = [],
  captions,
  traumaInformed = true,
  autoplay = false
}: VideoGuideProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentAnnotations, setCurrentAnnotations] = useState<TimecodedAnnotation[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleTimeUpdate = () => {
        const time = video.currentTime;
        setCurrentTime(time);
        
        // Find active annotations
        const activeAnnotations = annotations.filter(ann => 
          time >= ann.timestamp && time <= ann.timestamp + ann.duration
        );
        setCurrentAnnotations(activeAnnotations);
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      };
    }
  }, [annotations]);

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎥</span>
            <h4 className="font-medium text-sanctuary-gray-800">
              {traumaInformed ? 'Gentle Video Walkthrough' : 'Video Guide'}
            </h4>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlayback}
              className="text-sage-600 hover:text-sage-700"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
          </div>
        </div>
        
        {traumaInformed && (
          <p className="text-sm text-sanctuary-gray-600">
            This video shows each step gently. You can pause anytime and replay any section.
          </p>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-auto"
            poster={poster}
            controls
            autoPlay={autoplay}
            muted={autoplay}
          >
            <source src={src} type="video/mp4" />
            {captions && <track kind="captions" src={captions} srcLang="en" default />}
            Your browser does not support the video tag.
          </video>
          
          {/* Time-coded Annotations */}
          {currentAnnotations.map(({ annotation }) => (
            <div
              key={`${annotation.id}-${currentTime}`}
              className="absolute bg-black/80 text-white p-3 rounded-lg max-w-xs"
              style={{
                left: `${annotation.x}px`,
                top: `${annotation.y}px`,
                animation: 'fadeIn 0.3s ease-in-out'
              }}
            >
              <div className="font-medium text-sm">
                {traumaInformed && annotation.traumaInformedLabel
                  ? annotation.traumaInformedLabel
                  : annotation.label
                }
              </div>
              {annotation.description && (
                <div className="text-xs mt-1 opacity-90">
                  {traumaInformed && annotation.traumaInformedDescription
                    ? annotation.traumaInformedDescription
                    : annotation.description
                  }
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Video Progress */}
        <div className="p-3 bg-sanctuary-gray-50 border-t">
          <div className="text-xs text-sanctuary-gray-600 mb-2">
            {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
          </div>
          <div className="w-full bg-sanctuary-gray-200 rounded-full h-1">
            <div 
              className="bg-sage-400 h-1 rounded-full transition-all duration-100"
              style={{ 
                width: videoRef.current ? `${(currentTime / videoRef.current.duration) * 100}%` : '0%' 
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function InteractiveWalkthrough({
  steps,
  traumaInformed = true,
  onComplete
}: InteractiveWalkthroughProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNextStep = () => {
    setCompletedSteps(prev => new Set([...prev, currentStepIndex]));
    
    if (isLastStep) {
      onComplete?.();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleStepJump = (stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
  };

  return (
    <div className="space-y-6">
      {/* Step Navigation */}
      <Card className="bg-sage-50/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sanctuary-gray-800">
              {traumaInformed ? 'Your Guided Journey' : 'Interactive Walkthrough'}
            </h3>
            <span className="text-sm text-sanctuary-gray-600">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepJump(index)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  index === currentStepIndex
                    ? 'bg-sage-400 text-white'
                    : completedSteps.has(index)
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-sanctuary-gray-100 text-sanctuary-gray-600 hover:bg-sanctuary-gray-200'
                }`}
                disabled={index > currentStepIndex && !completedSteps.has(index)}
              >
                {completedSteps.has(index) ? '✓' : index + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Step */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center text-sage-600 text-xl">
                {completedSteps.has(currentStepIndex) ? '✓' : currentStepIndex + 1}
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-medium text-sanctuary-gray-800 mb-2">
                {currentStep.title}
              </h3>
              <p className="text-sanctuary-gray-600">
                {traumaInformed && currentStep.traumaInformedDescription
                  ? currentStep.traumaInformedDescription
                  : currentStep.description
                }
              </p>
              
              {traumaInformed && currentStep.encouragement && (
                <div className="mt-3 p-3 bg-sage-50 rounded-lg border border-sage-100">
                  <p className="text-sm text-sage-700 italic">
                    💚 {currentStep.encouragement}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <AnnotatedScreenshot
            src={currentStep.screenshot}
            alt={`Step ${currentStepIndex + 1} screenshot`}
            annotations={currentStep.annotations}
            interactive={true}
            traumaInformed={traumaInformed}
          />
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStepIndex === 0}
          >
            Previous Step
          </Button>
          
          <div className="flex gap-2">
            {currentStep.nextAction && (
              <div className="text-sm text-sanctuary-gray-600 flex items-center gap-2">
                {currentStep.nextAction === 'click' && '👆 Click when ready'}
                {currentStep.nextAction === 'wait' && '⏳ Take your time'}
                {currentStep.nextAction === 'input' && '⌨️ Type when ready'}
                {currentStep.nextAction === 'observe' && '👀 Look for changes'}
              </div>
            )}
            
            <Button
              onClick={handleNextStep}
              className="bg-sage-400 hover:bg-sage-500 text-white"
            >
              {isLastStep ? '🎉 Complete Walkthrough' : 'Next Step'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export function BeforeAfterComparison({
  before,
  after,
  traumaInformed = true,
  splitDirection = 'horizontal'
}: BeforeAfterComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const position = splitDirection === 'horizontal'
      ? ((e.clientX - rect.left) / rect.width) * 100
      : ((e.clientY - rect.top) / rect.height) * 100;
    
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🔍</span>
          <h4 className="font-medium text-sanctuary-gray-800">
            {traumaInformed ? 'Your Progress Visualization' : 'Before & After Comparison'}
          </h4>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-red-50 rounded-lg border border-red-100">
            <div className="font-medium text-red-800 mb-1">{before.title}</div>
            <div className="text-red-600 text-xs">{before.description}</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="font-medium text-green-800 mb-1">{after.title}</div>
            <div className="text-green-600 text-xs">{after.description}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div
          ref={containerRef}
          className="relative overflow-hidden cursor-col-resize"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Before Image */}
          <img
            src={before.src}
            alt={before.alt}
            className="w-full h-auto block"
          />
          
          {/* After Image Overlay */}
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{
              width: splitDirection === 'horizontal' ? `${sliderPosition}%` : '100%',
              height: splitDirection === 'vertical' ? `${sliderPosition}%` : '100%'
            }}
          >
            <img
              src={after.src}
              alt={after.alt}
              className="w-full h-auto block"
              style={{
                width: splitDirection === 'horizontal' ? `${100 * (100 / sliderPosition)}%` : '100%',
                height: splitDirection === 'vertical' ? `${100 * (100 / sliderPosition)}%` : '100%'
              }}
            />
          </div>
          
          {/* Slider */}
          <div
            className={`absolute bg-white border-2 border-sage-400 shadow-lg ${
              splitDirection === 'horizontal' 
                ? 'top-0 bottom-0 w-1 cursor-col-resize' 
                : 'left-0 right-0 h-1 cursor-row-resize'
            }`}
            style={{
              [splitDirection === 'horizontal' ? 'left' : 'top']: `${sliderPosition}%`,
              transform: splitDirection === 'horizontal' ? 'translateX(-50%)' : 'translateY(-50%)'
            }}
            onMouseDown={handleMouseDown}
          >
            {/* Slider Handle */}
            <div
              className={`absolute bg-sage-400 rounded-full ${
                splitDirection === 'horizontal'
                  ? 'w-6 h-6 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
                  : 'w-6 h-6 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
              }`}
            >
              <div className="w-full h-full flex items-center justify-center text-white text-xs">
                ⟷
              </div>
            </div>
          </div>
          
          {/* Labels */}
          <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
            Before
          </div>
          <div className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
            After
          </div>
        </div>
        
        <div className="p-3 bg-sanctuary-gray-50 border-t text-center">
          <p className="text-xs text-sanctuary-gray-600">
            {traumaInformed 
              ? 'Drag the slider to see your sanctuary transformation'
              : 'Drag the slider to compare before and after'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}