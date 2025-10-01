/**
 * Advanced Image Analysis Utilities for ALCHM Visual Diagnostics
 * Privacy-preserving, trauma-informed screenshot and error detection
 */

export interface ImageAnalysisResult {
  dimensions: { width: number; height: number };
  fileSize: number;
  compression: CompressionResult;
  browserDetection: BrowserDetectionResult;
  deviceDetection: DeviceDetectionResult;
  errorDetection: ErrorDetectionResult;
  uiElementDetection: UIElementDetectionResult;
  textExtraction: TextExtractionResult;
  colorAnalysis: ColorAnalysisResult;
  privacyAnalysis: PrivacyAnalysisResult;
  confidence: number;
  analysisTime: number;
}

export interface CompressionResult {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  quality: number;
  technique: 'jpeg' | 'webp' | 'png';
  thumbnail?: string;
}

export interface BrowserDetectionResult {
  browser: 'chrome' | 'firefox' | 'safari' | 'edge' | 'unknown';
  confidence: number;
  version?: string;
  indicators: string[];
  uiElements: BrowserUIElement[];
}

export interface BrowserUIElement {
  type: 'addressbar' | 'toolbar' | 'tab' | 'bookmark' | 'menu';
  bounds: Rectangle;
  visible: boolean;
  style: string;
}

export interface DeviceDetectionResult {
  type: 'mobile' | 'tablet' | 'desktop';
  platform: 'ios' | 'android' | 'typeof window !== 'undefined' && windows' | 'macos' | 'linux' | 'unknown';
  screenSize: { width: number; height: number };
  pixelDensity: number;
  orientation: 'portrait' | 'landscape';
  confidence: number;
  indicators: string[];
}

export interface ErrorDetectionResult {
  errors: DetectedError[];
  severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
  categories: ErrorCategory[];
  confidence: number;
}

export interface DetectedError {
  id: string;
  type: ErrorType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  bounds: Rectangle;
  description: string;
  traumaInformedDescription: string;
  confidence: number;
  suggestedFix: string;
  traumaInformedFix: string;
  relatedElements: string[];
}

export interface ErrorCategory {
  type: ErrorType;
  count: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export type ErrorType = 
  | 'authentication_error'
  | 'network_error'
  | 'loading_error'
  | 'form_validation_error'
  | 'permission_error'
  | 'server_error'
  | 'ui_layout_error'
  | 'browser_compatibility_error'
  | 'unknown_error';

export interface UIElementDetectionResult {
  elements: DetectedUIElement[];
  layout: LayoutAnalysis;
  accessibility: AccessibilityAnalysis;
  interactivity: InteractivityAnalysis;
}

export interface DetectedUIElement {
  id: string;
  type: UIElementType;
  bounds: Rectangle;
  state: ElementState;
  text?: string;
  confidence: number;
  clickable: boolean;
  visible: boolean;
  style: ElementStyle;
}

export type UIElementType = 
  | 'button'
  | 'input'
  | 'link'
  | 'image'
  | 'text'
  | 'modal'
  | 'dropdown'
  | 'checkbox'
  | 'radio'
  | 'navigation'
  | 'form'
  | 'error_message'
  | 'loading_indicator';

export type ElementState = 
  | 'normal'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'loading'
  | 'error'
  | 'success'
  | 'focus';

export interface ElementStyle {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  fontSize?: number;
  fontWeight?: string;
  borderRadius?: number;
  shadow?: boolean;
}

export interface LayoutAnalysis {
  responsive: boolean;
  gridSystem: boolean;
  alignment: 'left' | 'center' | 'right' | 'justified';
  spacing: SpacingAnalysis;
  hierarchy: HierarchyAnalysis;
}

export interface SpacingAnalysis {
  consistent: boolean;
  margins: number[];
  padding: number[];
  gaps: number[];
}

export interface HierarchyAnalysis {
  headingLevels: number[];
  textSizes: number[];
  visualHierarchy: 'good' | 'poor' | 'unclear';
}

export interface AccessibilityAnalysis {
  contrastRatio: number;
  colorBlindnessCompliant: boolean;
  keyboardNavigable: boolean;
  screenReaderFriendly: boolean;
  issues: AccessibilityIssue[];
}

export interface AccessibilityIssue {
  type: 'contrast' | 'missing_alt' | 'no_labels' | 'keyboard_trap' | 'focus_order';
  severity: 'low' | 'medium' | 'high';
  element: Rectangle;
  description: string;
  solution: string;
}

export interface InteractivityAnalysis {
  clickableElements: number;
  formElements: number;
  navigationElements: number;
  interactionPatterns: InteractionPattern[];
}

export interface InteractionPattern {
  type: 'form_submission' | 'navigation' | 'data_entry' | 'media_control';
  steps: InteractionStep[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface InteractionStep {
  element: UIElementType;
  action: 'click' | 'type' | 'scroll' | 'drag';
  description: string;
  traumaInformedDescription: string;
}

export interface TextExtractionResult {
  extractedText: ExtractedText[];
  language: string;
  readability: ReadabilityAnalysis;
  sentiment: SentimentAnalysis;
}

export interface ExtractedText {
  text: string;
  bounds: Rectangle;
  confidence: number;
  type: 'heading' | 'paragraph' | 'label' | 'error' | 'button' | 'link';
  fontSize: number;
  fontWeight: string;
  color: string;
}

export interface ReadabilityAnalysis {
  fleschScore: number;
  gradeLevel: number;
  averageWordsPerSentence: number;
  complexWords: number;
  traumaInformed: boolean;
}

export interface SentimentAnalysis {
  overall: 'positive' | 'neutral' | 'negative';
  confidence: number;
  traumaIndicators: string[];
  supportiveLanguage: boolean;
}

export interface ColorAnalysisResult {
  dominantColors: ColorInfo[];
  colorScheme: 'monochrome' | 'analogous' | 'triadic' | 'complementary' | 'custom';
  accessibility: ColorAccessibility;
  branding: BrandingAnalysis;
}

export interface ColorInfo {
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  percentage: number;
  usage: 'background' | 'text' | 'accent' | 'border';
}

export interface ColorAccessibility {
  wcagCompliant: boolean;
  contrastRatios: ContrastRatio[];
  colorBlindSupport: ColorBlindSupport;
}

export interface ContrastRatio {
  foreground: string;
  background: string;
  ratio: number;
  level: 'AA' | 'AAA' | 'fail';
}

export interface ColorBlindSupport {
  protanopia: boolean;
  deuteranopia: boolean;
  tritanopia: boolean;
  issues: string[];
}

export interface BrandingAnalysis {
  matchesAlchmBrand: boolean;
  colorHarmony: number;
  professionalAppearance: boolean;
  traumaInformedDesign: boolean;
}

export interface PrivacyAnalysisResult {
  sensitiveDataDetected: SensitiveData[];
  privacyRisk: 'low' | 'medium' | 'high';
  recommendedBlurring: Rectangle[];
  autoBlurApplied: boolean;
}

export interface SensitiveData {
  type: 'email' | 'phone' | 'address' | 'name' | 'payment' | 'personal_id' | 'medical';
  bounds: Rectangle;
  confidence: number;
  masked: boolean;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Main Image Analyzer class
 */
export class ImageAnalyzer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private traumaInformed: boolean;

  constructor(traumaInformed = true) {
    this.traumaInformed = traumaInformed;
    this.canvas = typeof window !== 'undefined' && document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * Analyze an uploaded image file
   */
  async analyzeImage(file: File): Promise<ImageAnalysisResult> {
    const startTime = performance.now();
    
    try {
      // Load image
      const imageData = await this.loadImageData(file);
      
      // Run all analysis modules in parallel for performance
      const [
        compression,
        browserDetection,
        deviceDetection,
        errorDetection,
        uiElementDetection,
        textExtraction,
        colorAnalysis,
        privacyAnalysis
      ] = await Promise.all([
        this.compressImage(file, imageData),
        this.detectBrowser(imageData),
        this.detectDevice(imageData),
        this.detectErrors(imageData),
        this.detectUIElements(imageData),
        this.extractText(imageData),
        this.analyzeColors(imageData),
        this.analyzePrivacy(imageData)
      ]);

      const analysisTime = performance.now() - startTime;
      
      // Calculate overall confidence score
      const confidence = this.calculateConfidence([
        browserDetection.confidence,
        deviceDetection.confidence,
        errorDetection.confidence,
        textExtraction.readability.traumaInformed ? 0.9 : 0.7
      ]);

      return {
        dimensions: { width: imageData.width, height: imageData.height },
        fileSize: file.size,
        compression,
        browserDetection,
        deviceDetection,
        errorDetection,
        uiElementDetection,
        textExtraction,
        colorAnalysis,
        privacyAnalysis,
        confidence,
        analysisTime
      };
    } catch (error) {
      console.error('Image analysis failed:', error);
      throw new Error(this.traumaInformed 
        ? 'We had trouble analyzing your image, but that\'s okay. We can still help you.'
        : 'Image analysis failed. Please try a different image.');
    }
  }

  /**
   * Load image data from file
   */
  private async loadImageData(file: File): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.ctx.drawImage(img, 0, 0);
        
        try {
          const imageData = this.ctx.getImageData(0, 0, img.width, img.height);
          resolve(imageData);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Compress image with optimization
   */
  private async compressImage(file: File, imageData: ImageData): Promise<CompressionResult> {
    const originalSize = file.size;
    
    // Create compressed version
    this.canvas.width = Math.min(imageData.width, 1920);
    this.canvas.height = Math.min(imageData.height, 1080);
    
    // Draw scaled image
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    return new Promise((resolve) => {
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        
        this.canvas.toBlob((blob) => {
          const compressedSize = blob?.size || originalSize;
          const compressionRatio = originalSize / compressedSize;
          
          // Create thumbnail
          const thumbnailCanvas = typeof window !== 'undefined' && document.createElement('canvas');
          const thumbnailCtx = thumbnailCanvas.getContext('2d')!;
          thumbnailCanvas.width = 150;
          thumbnailCanvas.height = 100;
          thumbnailCtx.drawImage(img, 0, 0, 150, 100);
          const thumbnail = thumbnailCanvas.toDataURL('image/jpeg', 0.7);
          
          resolve({
            originalSize,
            compressedSize,
            compressionRatio,
            quality: 0.8,
            technique: 'jpeg',
            thumbnail
          });
        }, 'image/jpeg', 0.8);
      };
    });
  }

  /**
   * Detect browser from UI elements
   */
  private async detectBrowser(imageData: ImageData): Promise<BrowserDetectionResult> {
    // Simulate browser detection logic
    // In real implementation, this would use ML models to detect browser chrome
    const mockResult: BrowserDetectionResult = {
      browser: 'chrome',
      confidence: 0.85,
      version: '120.0.0',
      indicators: ['chrome-style-tabs', 'google-font-rendering', 'shadow-dom-elements'],
      uiElements: [
        {
          type: 'addressbar',
          bounds: { x: 0, y: 0, width: imageData.width, height: 60 },
          visible: true,
          style: 'chrome-omnibox'
        }
      ]
    };
    
    return mockResult;
  }

  /**
   * Detect device type and platform
   */
  private async detectDevice(imageData: ImageData): Promise<DeviceDetectionResult> {
    const aspectRatio = imageData.width / imageData.height;
    const pixelCount = imageData.width * imageData.height;
    
    let type: 'mobile' | 'tablet' | 'desktop';
    if (imageData.width < 768) {
      type = 'mobile';
    } else if (imageData.width < 1024) {
      type = 'tablet';
    } else {
      type = 'desktop';
    }
    
    return {
      type,
      platform: 'unknown',
      screenSize: { width: imageData.width, height: imageData.height },
      pixelDensity: 1,
      orientation: aspectRatio > 1 ? 'landscape' : 'portrait',
      confidence: 0.8,
      indicators: [`aspect-ratio-${aspectRatio.toFixed(2)}`, `pixel-count-${pixelCount}`]
    };
  }

  /**
   * Detect errors in the UI
   */
  private async detectErrors(imageData: ImageData): Promise<ErrorDetectionResult> {
    // Simulate error detection using color patterns and text analysis
    const errors: DetectedError[] = [];
    
    // Look for red error indicators
    const data = imageData.data;
    const redPixels = [];
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Detect red error colors
      if (r > 200 && g < 100 && b < 100) {
        const x = (i / 4) % imageData.width;
        const y = Math.floor((i / 4) / imageData.width);
        redPixels.push({ x, y });
      }
    }
    
    // Group red pixels into error regions
    if (redPixels.length > 100) {
      errors.push({
        id: 'error-1',
        type: 'authentication_error',
        severity: 'medium',
        bounds: { x: 300, y: 200, width: 400, height: 100 },
        description: 'Login error detected in form validation',
        traumaInformedDescription: 'It looks like your login screen is having some trouble. This happens to everyone and we can work through it together.',
        confidence: 0.75,
        suggestedFix: 'Clear browser cache and try again',
        traumaInformedFix: 'Let\'s start fresh by clearing your browser\'s memory, then try logging in again at your own pace.',
        relatedElements: ['login-form', 'password-field']
      });
    }
    
    const severity = errors.length > 0 ? 'medium' : 'none';
    const categories = this.categorizeErrors(errors);
    
    return {
      errors,
      severity,
      categories,
      confidence: 0.8
    };
  }

  /**
   * Detect UI elements
   */
  private async detectUIElements(imageData: ImageData): Promise<UIElementDetectionResult> {
    // Simulate UI element detection
    const elements: DetectedUIElement[] = [
      {
        id: 'button-1',
        type: 'button',
        bounds: { x: 400, y: 300, width: 120, height: 40 },
        state: 'normal',
        text: 'Login',
        confidence: 0.9,
        clickable: true,
        visible: true,
        style: {
          backgroundColor: '#10b981',
          textColor: '#ffffff',
          borderRadius: 8
        }
      }
    ];
    
    return {
      elements,
      layout: {
        responsive: true,
        gridSystem: true,
        alignment: 'center',
        spacing: {
          consistent: true,
          margins: [16, 24, 16, 24],
          padding: [12, 16, 12, 16],
          gaps: [8, 16, 24]
        },
        hierarchy: {
          headingLevels: [1, 2, 3],
          textSizes: [12, 14, 16, 18, 24],
          visualHierarchy: 'good'
        }
      },
      accessibility: {
        contrastRatio: 4.5,
        colorBlindnessCompliant: true,
        keyboardNavigable: true,
        screenReaderFriendly: true,
        issues: []
      },
      interactivity: {
        clickableElements: 5,
        formElements: 3,
        navigationElements: 2,
        interactionPatterns: []
      }
    };
  }

  /**
   * Extract text from image
   */
  private async extractText(imageData: ImageData): Promise<TextExtractionResult> {
    // Simulate OCR text extraction
    const extractedText: ExtractedText[] = [
      {
        text: 'Welcome to ALCHM',
        bounds: { x: 100, y: 50, width: 200, height: 30 },
        confidence: 0.95,
        type: 'heading',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937'
      },
      {
        text: 'Please enter your email and password',
        bounds: { x: 100, y: 150, width: 300, height: 20 },
        confidence: 0.88,
        type: 'paragraph',
        fontSize: 14,
        fontWeight: 'normal',
        color: '#6b7280'
      }
    ];
    
    return {
      extractedText,
      language: 'en',
      readability: {
        fleschScore: 65,
        gradeLevel: 8,
        averageWordsPerSentence: 12,
        complexWords: 2,
        traumaInformed: true
      },
      sentiment: {
        overall: 'neutral',
        confidence: 0.7,
        traumaIndicators: [],
        supportiveLanguage: true
      }
    };
  }

  /**
   * Analyze colors in the image
   */
  private async analyzeColors(imageData: ImageData): Promise<ColorAnalysisResult> {
    const data = imageData.data;
    const colorCounts = new Map<string, number>();
    
    // Sample pixels for performance
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1);
    }
    
    // Get dominant colors
    const sortedColors = Array.from(colorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    const totalPixels = imageData.width * imageData.height;
    const dominantColors: ColorInfo[] = sortedColors.map(([hex, count]) => {
      const r = parseInt(hex.substr(1, 2), 16);
      const g = parseInt(hex.substr(3, 2), 16);
      const b = parseInt(hex.substr(5, 2), 16);
      
      return {
        hex,
        rgb: [r, g, b],
        hsl: this.rgbToHsl(r, g, b),
        percentage: (count / totalPixels) * 100,
        usage: 'background' // Simplified
      };
    });
    
    return {
      dominantColors,
      colorScheme: 'custom',
      accessibility: {
        wcagCompliant: true,
        contrastRatios: [],
        colorBlindSupport: {
          protanopia: true,
          deuteranopia: true,
          tritanopia: true,
          issues: []
        }
      },
      branding: {
        matchesAlchmBrand: true,
        colorHarmony: 0.8,
        professionalAppearance: true,
        traumaInformedDesign: true
      }
    };
  }

  /**
   * Analyze privacy and sensitive data
   */
  private async analyzePrivacy(imageData: ImageData): Promise<PrivacyAnalysisResult> {
    // Simulate privacy analysis
    const sensitiveDataDetected: SensitiveData[] = [];
    const recommendedBlurring: Rectangle[] = [];
    
    // Check for email patterns, phone numbers, etc.
    // This would use more sophisticated pattern recognition in production
    
    return {
      sensitiveDataDetected,
      privacyRisk: 'low',
      recommendedBlurring,
      autoBlurApplied: false
    };
  }

  /**
   * Helper methods
   */
  private categorizeErrors(errors: DetectedError[]): ErrorCategory[] {
    const categories = new Map<ErrorType, ErrorCategory>();
    
    errors.forEach(error => {
      const existing = categories.get(error.type);
      if (existing) {
        existing.count++;
        if (this.severityToNumber(error.severity) > this.severityToNumber(existing.severity)) {
          existing.severity = error.severity;
        }
      } else {
        categories.set(error.type, {
          type: error.type,
          count: 1,
          severity: error.severity
        });
      }
    });
    
    return Array.from(categories.values());
  }

  private severityToNumber(severity: string): number {
    switch (severity) {
      case 'low': return 1;
      case 'medium': return 2;
      case 'high': return 3;
      case 'critical': return 4;
      default: return 0;
    }
  }

  private calculateConfidence(scores: number[]): number {
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  private rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return [h * 360, s * 100, l * 100];
  }
}

/**
 * Factory function for creating analyzer instances
 */
export function createImageAnalyzer(traumaInformed = true): ImageAnalyzer {
  return new ImageAnalyzer(traumaInformed);
}