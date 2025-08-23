// Image optimization utilities for ALCHM performance
export interface ImageOptimizationConfig {
  quality: number
  format: 'webp' | 'avif' | 'jpeg' | 'png'
  sizes: number[]
  lazy: boolean
  priority: boolean
  placeholder: 'blur' | 'empty'
}

// Default configuration for different image types
export const IMAGE_CONFIGS = {
  hero: {
    quality: 85,
    format: 'webp' as const,
    sizes: [640, 828, 1200, 1920],
    lazy: false,
    priority: true,
    placeholder: 'blur' as const
  },
  content: {
    quality: 80,
    format: 'webp' as const,
    sizes: [320, 640, 828],
    lazy: true,
    priority: false,
    placeholder: 'blur' as const
  },
  thumbnail: {
    quality: 75,
    format: 'webp' as const,
    sizes: [64, 128, 256],
    lazy: true,
    priority: false,
    placeholder: 'empty' as const
  },
  icon: {
    quality: 90,
    format: 'png' as const,
    sizes: [24, 32, 48, 96],
    lazy: false,
    priority: true,
    placeholder: 'empty' as const
  }
}

// Image optimization utilities
export class ImageOptimizer {
  // Generate responsive image srcset
  static generateSrcSet(src: string, sizes: number[], format: string = 'webp'): string {
    return sizes
      .map(size => {
        const optimizedSrc = this.getOptimizedUrl(src, size, format)
        return `${optimizedSrc} ${size}w`
      })
      .join(', ')
  }

  // Generate sizes attribute for responsive images
  static generateSizes(breakpoints: { [key: string]: number }): string {
    const entries = Object.entries(breakpoints)
      .sort(([, a], [, b]) => b - a) // Sort by breakpoint descending
      .map(([media, size]) => `(max-width: ${media}px) ${size}px`)
    
    // Add default size (largest)
    const defaultSize = Math.max(...Object.values(breakpoints))
    return [...entries, `${defaultSize}px`].join(', ')
  }

  // Get optimized image URL
  static getOptimizedUrl(src: string, width?: number, format?: string, quality?: number): string {
    if (typeof window === 'undefined') return src

    const params = new URLSearchParams()
    if (width) params.set('w', width.toString())
    if (format) params.set('f', format)
    if (quality) params.set('q', quality.toString())

    // For external URLs, return as-is (would need image service integration)
    if (src.startsWith('http')) {
      return src
    }

    // For local images, use Next.js image optimization
    const separator = src.includes('?') ? '&' : '?'
    return `${src}${separator}${params.toString()}`
  }

  // Lazy load images with Intersection Observer
  static initializeLazyLoading(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return
    }

    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            this.loadImage(img)
            observer.unobserve(img)
          }
        })
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before image enters viewport
        threshold: 0.1
      }
    )

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img)
    })
  }

  // Load image with fade-in effect
  private static loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src
    const srcset = img.dataset.srcset

    if (!src) return

    // Create a new image to preload
    const newImg = new Image()
    
    newImg.onload = () => {
      // Update img attributes
      img.src = src
      if (srcset) img.srcset = srcset
      
      // Remove lazy loading attributes
      img.removeAttribute('data-src')
      img.removeAttribute('data-srcset')
      
      // Add loaded class for CSS animations
      img.classList.add('loaded')
      img.classList.remove('lazy')
    }

    newImg.onerror = () => {
      // Show fallback image
      img.src = this.getFallbackImage()
      img.classList.add('error')
    }

    if (srcset) newImg.srcset = srcset
    newImg.src = src
  }

  // Get fallback placeholder image
  static getFallbackImage(): string {
    return 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#f3f4f6"/>
        <text x="100" y="100" text-anchor="middle" dy=".3em" font-family="system-ui" font-size="14" fill="#6b7280">
          Image unavailable
        </text>
      </svg>
    `)
  }

  // Generate blur placeholder
  static generateBlurPlaceholder(src: string): string {
    // In a real implementation, this would generate a low-quality blur placeholder
    // For now, return a simple gray placeholder
    return 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#e5e7eb"/>
      </svg>
    `)
  }

  // Preload critical images
  static preloadCriticalImages(images: string[]): void {
    if (typeof window === 'undefined') return

    images.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })
  }

  // Convert image to WebP format (client-side conversion for uploaded images)
  static async convertToWebP(file: File, quality: number = 0.8): Promise<Blob | null> {
    if (typeof window === 'undefined') return null

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return null

      const img = new Image()
      
      return new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
          
          canvas.toBlob(
            (blob) => resolve(blob),
            'image/webp',
            quality
          )
        }
        
        img.onerror = () => resolve(null)
        img.src = URL.createObjectURL(file)
      })
    } catch (error) {
      console.warn('WebP conversion failed:', error)
      return null
    }
  }

  // Get image dimensions
  static getImageDimensions(src: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      
      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }
      
      img.src = src
    })
  }

  // Optimize image file size
  static async optimizeImageFile(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> {
    if (typeof window === 'undefined') return file

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return file

      const img = new Image()
      
      return new Promise((resolve) => {
        img.onload = () => {
          // Calculate new dimensions
          let { width, height } = img
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }

          canvas.width = width
          canvas.height = height
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const optimizedFile = new File([blob], file.name, {
                  type: 'image/webp',
                  lastModified: Date.now()
                })
                resolve(optimizedFile)
              } else {
                resolve(file)
              }
            },
            'image/webp',
            quality
          )
        }
        
        img.onerror = () => resolve(file)
        img.src = URL.createObjectURL(file)
      })
    } catch (error) {
      console.warn('Image optimization failed:', error)
      return file
    }
  }
}

// React hook for optimized images
export function useOptimizedImage(src: string, config: Partial<ImageOptimizationConfig> = {}) {
  const finalConfig = { ...IMAGE_CONFIGS.content, ...config }
  
  const srcSet = ImageOptimizer.generateSrcSet(src, finalConfig.sizes, finalConfig.format)
  const sizes = ImageOptimizer.generateSizes({
    '640': 640,
    '828': 828,
    '1200': 1200
  })
  
  const optimizedSrc = ImageOptimizer.getOptimizedUrl(
    src,
    finalConfig.sizes[finalConfig.sizes.length - 1],
    finalConfig.format,
    finalConfig.quality
  )

  return {
    src: optimizedSrc,
    srcSet,
    sizes,
    loading: finalConfig.lazy ? 'lazy' as const : 'eager' as const,
    placeholder: finalConfig.placeholder === 'blur' 
      ? ImageOptimizer.generateBlurPlaceholder(src) 
      : undefined
  }
}

// Performance monitoring for images
export class ImagePerformanceMonitor {
  private static loadTimes = new Map<string, number>()
  private static failedImages = new Set<string>()

  static trackImageLoad(src: string, startTime: number): void {
    const loadTime = performance.now() - startTime
    this.loadTimes.set(src, loadTime)
    
    // Log slow loading images
    if (loadTime > 3000) {
      console.warn(`Slow image load (${loadTime.toFixed(0)}ms):`, src)
    }
  }

  static trackImageError(src: string): void {
    this.failedImages.add(src)
    console.error('Failed to load image:', src)
  }

  static getStats(): {
    averageLoadTime: number
    slowImages: Array<{ src: string; loadTime: number }>
    failedImages: string[]
  } {
    const loadTimes = Array.from(this.loadTimes.values())
    const averageLoadTime = loadTimes.length > 0 
      ? loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length 
      : 0

    const slowImages = Array.from(this.loadTimes.entries())
      .filter(([, time]) => time > 2000)
      .map(([src, loadTime]) => ({ src, loadTime }))
      .sort((a, b) => b.loadTime - a.loadTime)

    return {
      averageLoadTime,
      slowImages,
      failedImages: Array.from(this.failedImages)
    }
  }

  static generateReport(): string {
    const stats = this.getStats()
    
    let report = '🖼️ Image Performance Report\n'
    report += '=' .repeat(30) + '\n\n'
    
    report += `📊 Average Load Time: ${stats.averageLoadTime.toFixed(0)}ms\n`
    report += `❌ Failed Images: ${stats.failedImages.length}\n`
    report += `🐌 Slow Images (>2s): ${stats.slowImages.length}\n\n`
    
    if (stats.slowImages.length > 0) {
      report += '🐌 Slowest Images:\n'
      stats.slowImages.slice(0, 5).forEach(({ src, loadTime }, index) => {
        report += `  ${index + 1}. ${src}: ${loadTime.toFixed(0)}ms\n`
      })
      report += '\n'
    }
    
    if (stats.failedImages.length > 0) {
      report += '❌ Failed Images:\n'
      stats.failedImages.slice(0, 5).forEach((src, index) => {
        report += `  ${index + 1}. ${src}\n`
      })
    }
    
    return report
  }
}

// Initialize image optimization on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    ImageOptimizer.initializeLazyLoading()
  })
}