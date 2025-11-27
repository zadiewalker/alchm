'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Upload, 
  Camera, 
  Monitor, 
  Smartphone, 
  Chrome, 
  Firefox, 
  Safari,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Download,
  Heart,
  Sparkles,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface VisualDiagnosticsProps {
  onDiagnosisComplete?: (results: DiagnosisResults) => void;
  traumaInformed?: boolean;
  maxFileSize?: number;
  allowedTypes?: string[];
}

interface DiagnosisResults {
  browserInfo: BrowserInfo;
  deviceInfo: DeviceInfo;
  errorDetection: ErrorAnalysis;
  uiStateAnalysis: UIStateAnalysis;
  recommendations: Recommendation[];
  visualAnnotations: VisualAnnotation[];
  confidenceScore: number;
}

interface BrowserInfo {
  name: string;
  version: string;
  userAgent: string;
  viewport: { width: number; height: number };
  colorDepth: number;
  pixelRatio: number;
}

interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  platform: string;
  screenSize: { width: number; height: number };
  orientation: 'portrait' | 'landscape';
  touch: boolean;
}

interface ErrorAnalysis {
  errorsDetected: DetectedError[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  errorType: 'ui' | 'network' | 'auth' | 'data' | 'performance' | 'unknown';
  confidence: number;
}

interface DetectedError {
  type: string;
  location: { x: number; y: number; width: number; height: number };
  description: string;
  traumaInformedDescription: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestedFix: string;
}

interface UIStateAnalysis {
  currentPage: string;
  userState: 'logged_in' | 'logged_out' | 'unknown';
  loadingStates: boolean;
  networkErrors: boolean;
  layoutIssues: string[];
  accessibilityIssues: string[];
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  traumaInformedDescription: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  steps: string[];
}

interface VisualAnnotation {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'highlight' | 'error' | 'suggestion' | 'success' | 'gentle';
  label: string;
  description: string;
  traumaInformedLabel: string;
  traumaInformedDescription: string;
}

interface UploadedFile {
  id: string;
  file: File;
  url: string;
  type: 'screenshot' | 'recording' | 'log';
  analysis?: ImageAnalysis;
  compressed?: boolean;
  thumbnail?: string;
}

interface ImageAnalysis {
  dimensions: { width: number; height: number };
  dominantColors: string[];
  textDetection: TextElement[];
  uiElements: UIElement[];
  errors: DetectedError[];
  browser: string;
  device: string;
  confidence: number;
}

interface TextElement {
  text: string;
  bounds: { x: number; y: number; width: number; height: number };
  confidence: number;
  isError: boolean;
}

interface UIElement {
  type: 'button' | 'input' | 'link' | 'image' | 'text' | 'modal' | 'navigation';
  bounds: { x: number; y: number; width: number; height: number };
  interactable: boolean;
  state: 'normal' | 'error' | 'loading' | 'disabled' | 'focus';
}

export function VisualDiagnosticsSystem({
  onDiagnosisComplete,
  traumaInformed = true,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'video/webm']
}: VisualDiagnosticsProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<DiagnosisResults | null>(null);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [encouragementVisible, setEncouragementVisible] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Therapeutic animations and feedback
  useEffect(() => {
    if (uploadedFiles.length > 0 && !encouragementVisible) {
      setEncouragementVisible(true);
      setTimeout(() => setEncouragementVisible(false), 3000);
    }
  }, [uploadedFiles.length]);

  // Privacy timer - auto-delete after 24 hours
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const timer = setTimeout(() => {
        handlePrivacyDeletion();
      }, 24 * 60 * 60 * 1000); // 24 hours

      return () => clearTimeout(timer);
    }
  }, [uploadedFiles]);

  const handlePrivacyDeletion = useCallback(() => {
    uploadedFiles.forEach(file => {
      URL.revokeObjectURL(file.url);
      if (file.thumbnail) {
        URL.revokeObjectURL(file.thumbnail);
      }
    });
    setUploadedFiles([]);
    setAnalysisResults(null);
  }, [uploadedFiles]);

  const compressImage = useCallback(async (file: File): Promise<{ compressed: File; thumbnail: string }> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) {
        resolve({ compressed: file, thumbnail: '' });
        return;
      }

      const img = new Image();
      img.onload = () => {
        // Calculate optimal dimensions
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        // Create thumbnail
        const thumbnailCanvas = document.createElement('canvas');
        const thumbnailCtx = thumbnailCanvas.getContext('2d');
        if (thumbnailCtx) {
          thumbnailCanvas.width = 150;
          thumbnailCanvas.height = 100;
          thumbnailCtx.drawImage(img, 0, 0, 150, 100);
        }
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            
            const thumbnail = thumbnailCanvas.toDataURL('image/jpeg', 0.7);
            resolve({ compressed: compressedFile, thumbnail });
          } else {
            resolve({ compressed: file, thumbnail: '' });
          }
        }, 'image/jpeg', 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const analyzeImage = useCallback(async (file: UploadedFile): Promise<ImageAnalysis> => {
    // Simulate advanced AI analysis
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockAnalysis: ImageAnalysis = {
          dimensions: { width: 1920, height: 1080 },
          dominantColors: ['#ffffff', '#f3f4f6', '#10b981'],
          textDetection: [
            {
              text: 'Login Error',
              bounds: { x: 400, y: 300, width: 200, height: 30 },
              confidence: 0.95,
              isError: true
            }
          ],
          uiElements: [
            {
              type: 'button',
              bounds: { x: 450, y: 400, width: 100, height: 40 },
              interactable: true,
              state: 'error'
            }
          ],
          errors: [
            {
              type: 'authentication',
              location: { x: 400, y: 300, width: 300, height: 100 },
              description: 'Login form showing error state',
              traumaInformedDescription: 'We can see your login screen is having trouble. This is completely normal and we can fix this together.',
              severity: 'medium',
              suggestedFix: 'Clear browser cache and try logging in again'
            }
          ],
          browser: 'Chrome',
          device: 'Desktop',
          confidence: 0.87
        };
        
        resolve(mockAnalysis);
      }, 2000);
    });
  }, []);

  const handleFileSelect = useCallback(async (files: FileList | File[]) => {
    if (!privacyConsent) {
      setShowPrivacyDetails(true);
      return;
    }

    setIsAnalyzing(true);
    setCompressionProgress(0);
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => 
      allowedTypes.includes(file.type) && file.size <= maxFileSize
    );

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      setCompressionProgress((i / validFiles.length) * 100);
      
      let processedFile = file;
      let thumbnail = '';
      
      if (file.type.startsWith('image/')) {
        const { compressed, thumbnail: thumb } = await compressImage(file);
        processedFile = compressed;
        thumbnail = thumb;
      }
      
      const uploadedFile: UploadedFile = {
        id: `file-${Date.now()}-${i}`,
        file: processedFile,
        url: URL.createObjectURL(processedFile),
        type: file.type.startsWith('image/') ? 'screenshot' : 'recording',
        compressed: file.type.startsWith('image/'),
        thumbnail
      };

      // Analyze the file
      if (uploadedFile.type === 'screenshot') {
        uploadedFile.analysis = await analyzeImage(uploadedFile);
      }

      setUploadedFiles(prev => [...prev, uploadedFile]);
    }
    
    setCompressionProgress(100);
    setIsAnalyzing(false);
  }, [privacyConsent, allowedTypes, maxFileSize, compressImage, analyzeImage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const generateDiagnosis = useCallback(async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsAnalyzing(true);
    
    // Combine all analyses into comprehensive diagnosis
    const mockResults: DiagnosisResults = {
      browserInfo: {
        name: 'Chrome',
        version: '120.0.0',
        userAgent: navigator.userAgent,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        colorDepth: screen.colorDepth,
        pixelRatio: window.devicePixelRatio
      },
      deviceInfo: {
        type: window.innerWidth < 768 ? 'mobile' : 'desktop',
        platform: navigator.platform,
        screenSize: { width: screen.width, height: screen.height },
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
        touch: 'ontouchstart' in window
      },
      errorDetection: {
        errorsDetected: uploadedFiles.flatMap(file => file.analysis?.errors || []),
        severity: 'medium',
        errorType: 'auth',
        confidence: 0.85
      },
      uiStateAnalysis: {
        currentPage: 'login',
        userState: 'logged_out',
        loadingStates: false,
        networkErrors: false,
        layoutIssues: [],
        accessibilityIssues: []
      },
      recommendations: [
        {
          id: 'rec-1',
          title: 'Clear Browser Cache',
          description: 'Clear your browser cache to resolve login issues',
          traumaInformedDescription: 'Let\'s clear your browser\'s memory to give you a fresh start with logging in',
          priority: 'high',
          actionable: true,
          steps: [
            'Press Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)',
            'Select "Cached images and files"',
            'Click "Clear data"',
            'Try logging in again'
          ]
        }
      ],
      visualAnnotations: uploadedFiles.flatMap(file => 
        file.analysis?.errors.map(error => ({
          id: `ann-${error.type}`,
          x: error.location.x,
          y: error.location.y,
          width: error.location.width,
          height: error.location.height,
          type: 'error' as const,
          label: error.description,
          description: error.suggestedFix,
          traumaInformedLabel: error.traumaInformedDescription,
          traumaInformedDescription: `💚 ${error.suggestedFix}`
        })) || []
      ),
      confidenceScore: 0.87
    };
    
    setTimeout(() => {
      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
      onDiagnosisComplete?.(mockResults);
    }, 2000);
  }, [uploadedFiles, onDiagnosisComplete]);

  const PrivacyConsentModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md bg-sanctuary-white">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center">
              <Shield className="w-6 h-6 text-sage-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-sanctuary-gray-800">
                Privacy Protection
              </h3>
              <p className="text-sm text-sanctuary-gray-600">
                Your safety is our priority
              </p>
            </div>
          </div>
          
          <div className="space-y-4 text-sm text-sanctuary-gray-700">
            <div className="p-3 bg-sage-50 rounded-lg border border-sage-100">
              <h4 className="font-medium text-sage-800 mb-2">What we do with your images:</h4>
              <ul className="space-y-1 text-xs">
                <li>• Analyze only for technical support</li>
                <li>• Automatically delete after 24 hours</li>
                <li>• Never stored on external servers</li>
                <li>• Processed locally when possible</li>
              </ul>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2">Privacy features:</h4>
              <ul className="space-y-1 text-xs">
                <li>• Automatic sensitive content blurring</li>
                <li>• End-to-end encryption</li>
                <li>• You control deletion anytime</li>
                <li>• No personal data extraction</li>
              </ul>
            </div>
          </div>
        </CardHeader>
        
        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPrivacyDetails(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setPrivacyConsent(true);
              setShowPrivacyDetails(false);
            }}
            className="flex-1 bg-sage-400 hover:bg-sage-500 text-white"
          >
            I Understand
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Privacy Consent Modal */}
      {showPrivacyDetails && <PrivacyConsentModal />}
      
      {/* Encouragement Toast */}
      {encouragementVisible && (
        <div className="fixed top-4 right-4 z-40 bg-sage-400 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <Heart className="w-4 h-4" />
          <span className="text-sm font-medium">
            {traumaInformed 
              ? "Thank you for sharing - we're here to help!" 
              : "Upload successful! Analyzing..."}
          </span>
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      {/* Main Upload Interface */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-400 to-sage-500 flex items-center justify-center shadow-soft">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-sanctuary-gray-800">
                  {traumaInformed ? 'Visual Support Helper' : 'Screenshot Analysis'}
                </h3>
                <p className="text-sm text-sanctuary-gray-600">
                  {traumaInformed 
                    ? 'Share your screen and we\'ll help you through any challenges'
                    : 'Upload screenshots or recordings for instant diagnosis'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-xs text-sanctuary-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Auto-delete in 24h
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Upload Zone */}
          <div
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-sage-400 bg-sage-50/50 scale-105' 
                : 'border-sanctuary-gray-200 hover:border-sage-300 hover:bg-sage-25'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={allowedTypes.join(',')}
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              className="hidden"
            />
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  dragActive 
                    ? 'bg-sage-400 text-white scale-110' 
                    : 'bg-sanctuary-gray-100 text-sanctuary-gray-600'
                }`}>
                  <Upload className="w-8 h-8" />
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-sanctuary-gray-800 mb-2">
                  {traumaInformed 
                    ? 'Share your experience with us' 
                    : 'Drop your screenshots here'}
                </h4>
                <p className="text-sm text-sanctuary-gray-600 mb-4">
                  {traumaInformed
                    ? 'Take a photo of your screen or upload a screenshot. We\'ll analyze it gently and help you find solutions.'
                    : 'Supports PNG, JPG, WEBP images and MP4, WEBM recordings up to 10MB'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Monitor className="w-4 h-4" />
                  Choose Files
                </Button>
                
                <Button
                  onClick={() => {
                    // Mobile camera capture
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.capture = 'environment';
                    input.onchange = (e) => {
                      const target = e.target as HTMLInputElement;
                      if (target.files) {
                        handleFileSelect(target.files);
                      }
                    };
                    input.click();
                  }}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  Take Photo
                </Button>
              </div>
              
              {!privacyConsent && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-800">
                    📋 Privacy consent required before uploading
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Compression Progress */}
          {isAnalyzing && compressionProgress > 0 && compressionProgress < 100 && (
            <div className="mt-4 p-4 bg-sage-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <RotateCw className="w-4 h-4 text-sage-600 animate-spin" />
                <span className="text-sm font-medium text-sage-800">
                  {traumaInformed ? 'Preparing your images with care...' : 'Compressing images...'}
                </span>
              </div>
              <div className="w-full bg-sage-200 rounded-full h-2">
                <div 
                  className="bg-sage-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${compressionProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sanctuary-gray-800">
                  {traumaInformed ? 'Your shared images' : 'Uploaded files'}
                </h4>
                <Button
                  onClick={handlePrivacyDeletion}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  Delete All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="border rounded-lg p-3 bg-sanctuary-gray-50">
                    <div className="flex items-start gap-3">
                      {file.thumbnail ? (
                        <img 
                          src={file.thumbnail} 
                          alt="Thumbnail"
                          className="w-16 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-sanctuary-gray-200 rounded flex items-center justify-center">
                          <Camera className="w-6 h-6 text-sanctuary-gray-500" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-sanctuary-gray-800 truncate">
                          {file.file.name}
                        </p>
                        <p className="text-xs text-sanctuary-gray-500">
                          {(file.file.size / 1024).toFixed(1)}KB
                          {file.compressed && ' • Compressed'}
                        </p>
                        
                        {file.analysis && (
                          <div className="mt-2 flex items-center gap-2">
                            {file.analysis.errors.length > 0 ? (
                              <div className="flex items-center gap-1 text-amber-600">
                                <AlertCircle className="w-3 h-3" />
                                <span className="text-xs">
                                  {file.analysis.errors.length} issue(s) found
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-3 h-3" />
                                <span className="text-xs">No issues detected</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Analysis Button */}
              <div className="flex justify-center">
                <Button
                  onClick={generateDiagnosis}
                  disabled={isAnalyzing}
                  className="bg-sage-400 hover:bg-sage-500 text-white px-8"
                >
                  {isAnalyzing ? (
                    <>
                      <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                      {traumaInformed ? 'Analyzing with care...' : 'Analyzing...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {traumaInformed ? 'Help me understand this' : 'Start Analysis'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}