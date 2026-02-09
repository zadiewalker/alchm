'use client';

import { useState } from 'react';
import { 
  Cloud, 
  Shield, 
  Smartphone,
  CheckCircle,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';

interface MigrationPromptProps {
  migrationStatus: 'none' | 'pending' | 'running' | 'completed' | 'error';
  onMigrate: () => Promise<void>;
  onDismiss: () => void;
  isVisible: boolean;
}

export default function MigrationPrompt({ 
  migrationStatus, 
  onMigrate, 
  onDismiss, 
  isVisible 
}: MigrationPromptProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isVisible || isDismissed || migrationStatus === 'completed') {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss();
  };

  const handleMigrate = async () => {
    try {
      await onMigrate();
    } catch (error) {
      console.error('Migration failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
        
        {migrationStatus !== 'running' && (
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Cloud className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-light text-gray-900 mb-2">
            {migrationStatus === 'error' ? 'Migration Failed' : 'Sync Your Data'}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {migrationStatus === 'error' 
              ? 'There was an issue syncing your data. You can try again or continue using local storage.'
              : 'We found healing data on your device. Sync it to the cloud for safe keeping and access across all your devices.'
            }
          </p>
        </div>

        {/* Benefits */}
        {migrationStatus !== 'error' && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-800 mb-3">Benefits of cloud sync:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Secure backup of your journal entries and dreams</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Smartphone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Access your progress on any device</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Never lose your healing journey progress</span>
              </div>
            </div>
          </div>
        )}

        {/* Migration Status */}
        {migrationStatus === 'running' && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <div>
                <h4 className="text-blue-800 font-medium">Syncing your data...</h4>
                <p className="text-blue-700 text-sm">This may take a moment. Please don't close this window.</p>
              </div>
            </div>
          </div>
        )}

        {migrationStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <h4 className="text-red-800 font-medium">Sync failed</h4>
                <p className="text-red-700 text-sm">Your data is still safe on this device. You can try again later.</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {migrationStatus === 'pending' && (
            <>
              <button
                onClick={handleDismiss}
                className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={handleMigrate}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Sync Now
              </button>
            </>
          )}

          {migrationStatus === 'running' && (
            <div className="w-full text-center text-gray-600 text-sm">
              Syncing data securely...
            </div>
          )}

          {migrationStatus === 'error' && (
            <>
              <button
                onClick={handleDismiss}
                className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Continue Offline
              </button>
              <button
                onClick={handleMigrate}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </>
          )}
        </div>

        {/* Privacy note */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            <Shield className="w-3 h-3 inline mr-1" />
            Your data is encrypted and stored securely. We never access your personal journal content.
          </p>
        </div>
      </div>
    </div>
  );
}