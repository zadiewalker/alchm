/**
 * ALCHM Image Optimization System
 * 
 * Trauma-informed image loading with progressive enhancement,
 * lazy loading, and fallbacks for users on slow connections.
 */

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: 'blur' | 'empty' | string;
  isCrisisResource?: boolean;
}

interface ImageMetrics {
  src: string;
  loadTime: number;
  fromCache: boolean;
  fileSize?: number;
  format?: string;
  timestamp: number;
  isCrisisContext: boolean;
  connectionType?: string;
}

class ImageOptimizer {
  private imageCache: Map<string, HTMLImageElement> = new Map();
  private loadingImages: Map<string, Promise<HTMLImageElement>> = new Map();
  private metrics: ImageMetrics[] = [];
  private observer: IntersectionObserver | null = null;
  private connectionType: string = 'unknown';
  private supportedFormats: Set<string> = new Set();

  constructor() {
    this.initializeObserver();
    this.detectSupportedFormats();
    this.monitorConnection();
  }

  private initializeObserver(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            if (src) {
              this.loadImage(src, img);
              this.observer?.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );
  }

  private async detectSupportedFormats(): Promise<void> {
    if (typeof window === 'undefined') return;

    const formats = ['webp', 'avif', 'jp2'];
    
    for (const format of formats) {
      const supported = await this.canUseFormat(format);
      if (supported) {
        this.supportedFormats.add(format);
      }
    }
  }

  private canUseFormat(format: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      
      const testImages = {
        webp: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA',
        avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMgkQAAAAB0IOroCnhwAAABFjZTB3AAAeGQ==',
        jp2: 'data:image/jp2;base64,/0//UQAyAAAAAAABAAAAAgAAAAAAAAAAAAAABAAAAAQAAAAAAAAAAAAEBwEBBwEBBwEBBwEB/1QAEQAAAA=='
      };

      img.src = testImages[format as keyof typeof testImages] || '';
    });
  }

  private monitorConnection(): void {
    if (typeof window === 'undefined') return;

    const connection = (navigator as any).connection;
    if (connection) {
      this.connectionType = connection.effectiveType;
      connection.addEventListener('change', () => {
        this.connectionType = connection.effectiveType;
      });
    }
  }

  public optimizeImageSrc(src: string, width?: number, height?: number): string {
    if (!src) return '';

    // For crisis resources, always prioritize speed over optimization
    if (this.isCrisisResource(src)) {
      return src;
    }

    // Use modern formats if supported
    let optimizedSrc = src;
    
    if (this.supportedFormats.has('avif')) {
      optimizedSrc = this.convertToFormat(src, 'avif');
    } else if (this.supportedFormats.has('webp')) {
      optimizedSrc = this.convertToFormat(src, 'webp');
    }

    // Add responsive sizing
    if (width && height) {
      optimizedSrc = this.addSizeParams(optimizedSrc, width, height);
    }

    // Adjust quality based on connection
    const quality = this.getOptimalQuality();
    optimizedSrc = this.addQualityParam(optimizedSrc, quality);

    return optimizedSrc;
  }

  private convertToFormat(src: string, format: string): string {
    // This would integrate with your image optimization service
    // For now, return original src
    return src;
  }

  private addSizeParams(src: string, width: number, height: number): string {
    const url = new URL(src, window.location.origin);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('h', height.toString());
    return url.toString();
  }

  private addQualityParam(src: string, quality: number): string {
    const url = new URL(src, window.location.origin);
    url.searchParams.set('q', quality.toString());
    return url.toString();
  }

  private getOptimalQuality(): number {
    switch (this.connectionType) {
      case 'slow-2g':
      case '2g':
        return 50;
      case '3g':
        return 70;
      case '4g':
      default:
        return 85;
    }
  }

  private isCrisisResource(src: string): boolean {
    const crisisKeywords = ['crisis', 'emergency', 'help', 'support'];
    return crisisKeywords.some(keyword => src.toLowerCase().includes(keyword));
  }

  public async loadImage(src: string, targetElement?: HTMLImageElement): Promise<HTMLImageElement> {
    const startTime = performance.now();

    // Check cache first
    if (this.imageCache.has(src)) {
      const cachedImage = this.imageCache.get(src)!;
      if (targetElement) {
        this.applyImageToElement(cachedImage, targetElement);
      }
      this.recordMetrics(src, performance.now() - startTime, true);
      return cachedImage;
    }

    // Check if already loading
    if (this.loadingImages.has(src)) {
      const loadingImage = await this.loadingImages.get(src)!;
      if (targetElement) {
        this.applyImageToElement(loadingImage, targetElement);
      }
      return loadingImage;
    }

    // Start loading
    const loadPromise = this.createLoadPromise(src, startTime);
    this.loadingImages.set(src, loadPromise);

    try {
      const image = await loadPromise;
      if (targetElement) {
        this.applyImageToElement(image, targetElement);
      }
      return image;
    } finally {
      this.loadingImages.delete(src);
    }
  }

  private createLoadPromise(src: string, startTime: number): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        const loadTime = performance.now() - startTime;
        
        // Cache the image
        this.imageCache.set(src, img);
        
        // Record metrics
        this.recordMetrics(src, loadTime, false);
        
        resolve(img);
      };

      img.onerror = () => {
        console.error(`[IMAGE OPTIMIZER] Failed to load: ${src}`);
        reject(new Error(`Failed to load image: ${src}`));
      };

      // Set optimized source
      img.src = src;
    });
  }

  private applyImageToElement(source: HTMLImageElement, target: HTMLImageElement): void {
    target.src = source.src;
    target.removeAttribute('data-src');
    target.classList.remove('lazy-loading');
    target.classList.add('loaded');
  }

  private recordMetrics(src: string, loadTime: number, fromCache: boolean): void {
    const metric: ImageMetrics = {
      src,
      loadTime,
      fromCache,
      timestamp: Date.now(),
      isCrisisContext: this.isCrisisContext(),
      connectionType: this.connectionType
    };

    this.metrics.push(metric);

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Alert if crisis images load slowly
    if (this.isCrisisResource(src) && loadTime > 1000) {
      console.warn(`[IMAGE OPTIMIZER] Crisis image took ${loadTime}ms to load: ${src}`);
    }
  }

  private isCrisisContext(): boolean {
    if (typeof window === 'undefined') return false;
    
    const url = window.location.href.toLowerCase();
    return url.includes('crisis') || 
           url.includes('emergency') || 
           url.includes('support');
  }

  public setupLazyLoading(img: HTMLImageElement): void {
    if (!this.observer) return;

    img.classList.add('lazy-loading');
    this.observer.observe(img);
  }

  public generatePlaceholder(width: number, height: number, color: string = '#f3f4f6'): string {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">Loading...</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  public preloadCrisisImages(urls: string[]): Promise<HTMLImageElement[]> {
    console.log('[IMAGE OPTIMIZER] Preloading crisis images');
    return Promise.all(urls.map(url => this.loadImage(url)));
  }

  // Public API
  public getMetrics(timeRange?: number): ImageMetrics[] {
    if (!timeRange) return [...this.metrics];
    
    const cutoff = Date.now() - timeRange;
    return this.metrics.filter(m => m.timestamp >= cutoff);
  }

  public getCacheStats() {
    return {
      cachedImages: this.imageCache.size,
      loadingImages: this.loadingImages.size,
      supportedFormats: Array.from(this.supportedFormats),
      averageLoadTime: this.calculateAverageLoadTime()
    };
  }

  private calculateAverageLoadTime(): number {
    const nonCachedMetrics = this.metrics.filter(m => !m.fromCache);
    if (nonCachedMetrics.length === 0) return 0;
    
    const totalTime = nonCachedMetrics.reduce((sum, m) => sum + m.loadTime, 0);
    return totalTime / nonCachedMetrics.length;
  }

  public clearCache(): void {
    this.imageCache.clear();
    this.loadingImages.clear();
    console.log('[IMAGE OPTIMIZER] Image cache cleared');
  }

  public destroy(): void {
    this.observer?.disconnect();
    this.clearCache();
  }
}

// Singleton instance
let imageOptimizer: ImageOptimizer | null = null;

export function getImageOptimizer(): ImageOptimizer {
  if (!imageOptimizer) {
    imageOptimizer = new ImageOptimizer();
  }
  return imageOptimizer;
}

// React component for optimized images
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  onLoad,
  onError,
  placeholder,
  isCrisisResource = false,
  ...props
}: OptimizedImageProps) {
  const optimizer = getImageOptimizer();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const optimizedSrc = useMemo(() => {
    return optimizer.optimizeImageSrc(src, width, height);
  }, [src, width, height]);

  const placeholderSrc = useMemo(() => {
    if (placeholder === 'empty') return '';
    if (typeof placeholder === 'string') return placeholder;
    if (width && height) {
      return optimizer.generatePlaceholder(width, height);
    }
    return '';
  }, [placeholder, width, height]);

  useEffect(() => {
    if (!imgRef.current) return;

    const img = imgRef.current;

    if (priority || isCrisisResource) {
      // Load immediately for priority/crisis images
      optimizer.loadImage(optimizedSrc, img)
        .then(() => {
          setIsLoaded(true);
          onLoad?.();
        })
        .catch(() => {
          setError(true);
          onError?.();
        });
    } else {
      // Setup lazy loading
      img.dataset.src = optimizedSrc;
      optimizer.setupLazyLoading(img);
      
      // Listen for load completion
      img.addEventListener('load', () => {
        setIsLoaded(true);
        onLoad?.();
      });
      
      img.addEventListener('error', () => {
        setError(true);
        onError?.();
      });
    }
  }, [optimizedSrc, priority, isCrisisResource, onLoad, onError]);

  return (
    <img
      ref={imgRef}
      src={priority || isCrisisResource ? optimizedSrc : placeholderSrc}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${isLoaded ? 'loaded' : 'loading'} ${error ? 'error' : ''}`}
      loading={priority ? 'eager' : 'lazy'}
      {...props}
    />
  );
}

export type { OptimizedImageProps, ImageMetrics };
export default ImageOptimizer;