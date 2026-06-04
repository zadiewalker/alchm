'use client';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loading({ message = "Loading...", size = 'md' }: LoadingProps) {
  const iconSize = size === 'lg' ? 'w-12 h-12' : size === 'md' ? 'w-8 h-8' : 'w-6 h-6';
  const containerSize = size === 'lg' ? 'w-16 h-16' : size === 'md' ? 'w-12 h-12' : 'w-8 h-8';
  
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${containerSize} rounded-full bg-gradient-to-br from-gold/25 to-gold/15 border border-gold/15 flex items-center justify-center animate-pulse`}>
        <svg viewBox="0 0 100 100" className={`${iconSize} animate-spin`} style={{ animationDuration: '3s' }}>
          {/* Sun Disk - Golden circle */}
          <circle cx="50" cy="15" r="8" fill="#E5C97D" />
          
          {/* Head - Small circle below sun */}
          <circle cx="50" cy="28" r="5" fill="white" fillOpacity="0.7" />
          
          {/* Body - oval with stripes */}
          <ellipse cx="50" cy="55" rx="16" ry="24" fill="white" fillOpacity="0.7" />
          
          {/* Body stripes */}
          <line x1="37" y1="42" x2="63" y2="42" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
          <line x1="36" y1="50" x2="64" y2="50" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
          <line x1="36" y1="58" x2="64" y2="58" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
          <line x1="37" y1="66" x2="63" y2="66" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
          
          {/* Wings */}
          <path d="M34 48 Q18 40 22 60 Q24 70 34 65 Z" fill="white" fillOpacity="0.7" />
          <path d="M66 48 Q82 40 78 60 Q76 70 66 65 Z" fill="white" fillOpacity="0.7" />
        </svg>
      </div>
      
      {message && (
        <p className="text-white/70 text-sm text-center">{message}</p>
      )}
    </div>
  );
}