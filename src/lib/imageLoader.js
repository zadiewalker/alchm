// ALCHM Performance-Optimized Image Loader
// Crisis-focused image loading with sanctuary design support

export default function imageLoader({ src, width, quality }) {
  // Performance-first: return direct source for Firebase compatibility
  // while adding crisis-optimized loading hints
  
  if (typeof window !== 'undefined') {
    // Crisis optimization: detect slow connections
    const connection = navigator.connection;
    const isSlowConnection = connection && 
      (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    
    // Low-end device detection for performance
    const isLowEndDevice = navigator.hardwareConcurrency <= 2 || 
                          navigator.deviceMemory <= 2;
    
    // Store performance context for image optimization
    if (!window.__alchm_image_context) {
      window.__alchm_image_context = {
        isSlowConnection,
        isLowEndDevice,
        startTime: Date.now()
      };
    }
  }
  
  // Return original source for Firebase App Hosting compatibility
  // Image optimization is handled by CSS and progressive loading
  return src;
}

// Helper function for generating responsive image props
export function generateSanctuaryImageProps(src, alt, options = {}) {
  const {
    priority = false,
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    quality = 85,
    loading = priority ? 'eager' : 'lazy'
  } = options;
  
  // Base props optimized for sanctuary design
  const imageProps = {
    src,
    alt,
    loading,
    sizes,
    style: {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: 'var(--radius-lg)',
      objectFit: 'cover'
    }
  };
  
  // Priority loading for above-the-fold images
  if (priority) {
    imageProps.fetchPriority = 'high';
    imageProps.decoding = 'sync';
  } else {
    imageProps.decoding = 'async';
  }
  
  // Add intersection observer for performance tracking
  if (typeof window !== 'undefined') {
    imageProps.onLoad = () => {
      const context = window.__alchm_image_context;
      if (context) {
        const loadTime = Date.now() - context.startTime;
        trackImagePerformance(src, loadTime);
      }
    };
  }
  
  return imageProps;
}

// Crisis-optimized image preloader
export function preloadCrisisImages() {
  if (typeof window === 'undefined') return;
  
  const criticalImages = [
    '/icons/crisis-support.svg',
    '/images/sanctuary/breathing-guide-thumbnail.webp',
    '/favicon.ico'
  ];
  
  // Only preload if user has good network conditions
  const context = window.__alchm_image_context;
  if (context?.isSlowConnection) return;
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Performance monitoring for image loading
export function trackImagePerformance(src, loadTime) {
  if (typeof window === 'undefined') return;
  
  // Store for local performance monitoring
  try {
    const perfData = JSON.parse(localStorage.getItem('alchm-image-perf') || '[]');
    perfData.push({
      src: src.slice(0, 50), // Truncate for privacy
      loadTime,
      timestamp: Date.now()
    });
    
    // Keep only last 5 entries to prevent storage bloat
    if (perfData.length > 5) {
      perfData.splice(0, perfData.length - 5);
    }
    
    localStorage.setItem('alchm-image-perf', JSON.stringify(perfData));
  } catch (e) {
    // Fail silently to prevent blocking
  }
}