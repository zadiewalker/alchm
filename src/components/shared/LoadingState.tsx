'use client';

interface LoadingStateProps {
  message?: string;
  variant?: 'default' | 'minimal' | 'breathing' | 'constellation';
  size?: 'small' | 'medium' | 'large';
}

export function LoadingState({ 
  message = "Preparing your sanctuary...", 
  variant = 'default',
  size = 'medium'
}: LoadingStateProps) {
  const sizeClasses = {
    small: 'text-4xl',
    medium: 'text-6xl',
    large: 'text-8xl'
  };

  const containerClasses = {
    small: 'p-4',
    medium: 'p-8',
    large: 'p-12'
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white"></div>
      </div>
    );
  }

  if (variant === 'breathing') {
    return (
      <div className={`flex items-center justify-center ${containerClasses[size]}`}>
        <div className="text-center">
          <div className={`${sizeClasses[size]} mb-4 animate-pulse`}>🌿</div>
          <p className="text-white text-lg animate-pulse">{message}</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'constellation') {
    return (
      <div className={`flex items-center justify-center ${containerClasses[size]}`}>
        <div className="text-center">
          <div className="relative mb-6">
            <div className={`${sizeClasses[size]} animate-pulse`}>⭐</div>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="text-2xl animate-ping opacity-75 absolute top-2 -right-2">✨</div>
              <div className="text-xl animate-ping opacity-50 absolute -bottom-1 -left-2" style={{ animationDelay: '1s' }}>💫</div>
              <div className="text-lg animate-ping opacity-60 absolute top-1 left-1" style={{ animationDelay: '0.5s' }}>⚡</div>
            </div>
          </div>
          <p className="text-white text-lg">{message}</p>
        </div>
      </div>
    );
  }

  // Default sanctuary loading
  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #a4b792 0%, #8fa37c 100%)'
    }}>
      <div className="text-center">
        <div className={`${sizeClasses[size]} mb-4 animate-pulse`}>🌿</div>
        <p className="text-white text-lg">{message}</p>
        <div className="mt-6 w-32 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-white/60 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}