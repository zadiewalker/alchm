/**
 * Simplified FID Optimization for ALCHM
 * Production-ready performance optimization without complex dependencies
 */

export function useFIDOptimizedInteraction() {
  const createOptimizedHandler = (
    handler: () => void,
    options?: { priority?: string; immediate?: boolean }
  ) => {
    return (event: React.MouseEvent) => {
      // Prevent default if needed
      if (options?.immediate) {
        event.preventDefault();
      }
      
      // Add small delay for better perceived performance
      if (options?.priority === 'crisis') {
        // Immediate execution for crisis situations
        handler();
      } else {
        // Small delay for better UX
        setTimeout(handler, 50);
      }
    };
  };

  return { createOptimizedHandler };
}