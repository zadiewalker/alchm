/**
 * Simple Performance Optimized Layout
 */

import React from 'react';

interface PerformanceOptimizedLayoutProps {
  children: React.ReactNode;
}

export default function PerformanceOptimizedLayout({ children }: PerformanceOptimizedLayoutProps) {
  return <div className="performance-optimized-layout">{children}</div>;
}