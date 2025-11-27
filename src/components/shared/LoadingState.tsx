'use client';

interface LoadingStateProps {
  message?: string;
  variant?: 'default' | 'minimal' | 'breathing' | 'constellation' | 'luxury';
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
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-sage-400/50 border-t-sage-400 backdrop-blur-xl"></div>
      </div>
    );
  }

  if (variant === 'luxury') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-400 via-sage-400 to-sage-500 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-sanctuary-glass backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl border border-white/20 animate-gentle-breathe">
            <span className="text-4xl filter drop-shadow-sm">🪲</span>
          </div>
          <div className="bg-sanctuary-glass backdrop-blur-xl rounded-3xl px-12 py-8 shadow-xl border border-white/20 max-w-md">
            <h3 className="text-2xl font-light text-charcoal-800 mb-3 tracking-tight">Preparing sanctuary</h3>
            <p className="text-base font-light text-charcoal-600 leading-relaxed opacity-90">
              {message}
            </p>
            <div className="mt-8 w-40 h-1 bg-sage-400/20 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-sage-400 rounded-full animate-pulse w-1/3 transition-all duration-300 ease-out"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'breathing') {
    return (
      <div className={`flex items-center justify-center ${containerClasses[size]}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-sanctuary-glass backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/20 animate-gentle-breathe">
            <span className="text-3xl">🌿</span>
          </div>
          <div className="bg-sanctuary-glass backdrop-blur-xl rounded-2xl px-6 py-4 shadow-lg border border-white/20">
            <p className="text-white text-lg font-light animate-gentle-pulse">{message}</p>
            <div className="mt-4 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce transition-all duration-300 ease-out" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce transition-all duration-300 ease-out" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce transition-all duration-300 ease-out" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'constellation') {
    return (
      <div className={`flex items-center justify-center ${containerClasses[size]}`}>
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-sanctuary-glass backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-xl border border-white/20 animate-gentle-breathe">
              <span className="text-4xl animate-gentle-pulse">⭐</span>
            </div>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="text-2xl animate-gentle-sparkle opacity-75 absolute top-2 -right-2">✨</div>
              <div className="text-xl animate-gentle-sparkle opacity-50 absolute -bottom-1 -left-2" style={{ animationDelay: '1s' }}>💫</div>
              <div className="text-lg animate-gentle-sparkle opacity-60 absolute top-1 left-1" style={{ animationDelay: '0.5s' }}>⚡</div>
            </div>
          </div>
          <div className="bg-sanctuary-glass backdrop-blur-xl rounded-2xl px-6 py-4 shadow-lg border border-white/20">
            <p className="text-white text-lg font-light">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Default luxury sanctuary loading
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-400 via-sage-400 to-sage-500 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-sanctuary-glass backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/20 animate-gentle-breathe">
          <span className="text-3xl filter drop-shadow-sm">🌿</span>
        </div>
        <div className="bg-sanctuary-glass backdrop-blur-xl rounded-3xl px-8 py-6 shadow-xl border border-white/20 max-w-sm">
          <p className="text-white text-lg font-light leading-relaxed">{message}</p>
          <div className="mt-6 w-32 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-white/80 rounded-full animate-pulse transition-all duration-300 ease-out"></div>
          </div>
        </div>
      </div>
    </div>
  );
}