'use client';

import { useState, useEffect } from 'react';
import { getStreakState, StreakState, startKindnessBreak } from '@/lib/streaks';

const COLORS = {
  sage: '#a4b792',
  terracotta: '#cb997e',
  charcoal: '#2e2e2e',
  offWhite: '#f7f7f2',
};

export function StreakDisplay({ onUpdate }: { onUpdate?: () => void }) {
  const [state, setState] = useState<StreakState | null>(null);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showGraceModal, setShowGraceModal] = useState(false);

  useEffect(() => {
    getStreakState().then(setState).catch(console.error);
  }, []);

  const handleUseGrace = async () => {
    const { useGraceToken } = await import('@/lib/grace-tokens');
    const success = await useGraceToken('Preserve streak');
    if (success) {
      setShowGraceModal(false);
      getStreakState().then(setState);
      onUpdate?.();
    }
  };

  const handleStartBreak = async (days?: number) => {
    await startKindnessBreak(days, 'Needed rest');
    setShowBreakModal(false);
    getStreakState().then(setState);
    onUpdate?.();
  };

  if (!state) return null;

  // On kindness break
  if (state.isOnBreak) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
            🌿
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Kindness Break
            </h3>
            <p className="text-sm text-gray-500">
              Your {state.current}-day streak is preserved
            </p>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Rest is part of healing. When you return, you'll earn 1.5x XP as a welcome back.
        </p>
        
        {state.breakDaysRemaining !== undefined && (
          <p className="text-xs text-gray-500">
            Planned return in {state.breakDaysRemaining} day{state.breakDaysRemaining !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    );
  }

  // Needs grace
  if (state.needsGrace) {
    return (
      <>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center">
              💚
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                You missed a day
              </h3>
              <p className="text-sm text-gray-500">
                That's okay. Life happens.
              </p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Use a grace token to preserve your {state.current}-day streak, or let it reset. 
            Either choice is valid.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowGraceModal(true)}
              className="flex-1 py-3 rounded-xl font-medium text-white"
              style={{ backgroundColor: COLORS.sage }}
            >
              Use Grace Token
            </button>
            <button
              onClick={() => setShowBreakModal(true)}
              className="flex-1 py-3 rounded-xl font-medium text-gray-600 bg-gray-100"
            >
              Take a Break
            </button>
          </div>
        </div>

        {/* Grace Modal */}
        {showGraceModal && (
          <GraceModal 
            onConfirm={handleUseGrace}
            onCancel={() => setShowGraceModal(false)}
            streakToPreserve={state.current}
          />
        )}

        {/* Break Modal */}
        {showBreakModal && (
          <KindnessBreakModal
            onConfirm={handleStartBreak}
            onCancel={() => setShowBreakModal(false)}
            currentStreak={state.current}
          />
        )}
      </>
    );
  }

  // Normal streak display
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
      <div className="text-3xl mb-2">
        🔥
      </div>
      <div className="text-2xl font-bold text-gray-800">
        {state.current} day{state.current !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

// Grace Modal Component
function GraceModal({ 
  onConfirm, 
  onCancel, 
  streakToPreserve 
}: { 
  onConfirm: () => void; 
  onCancel: () => void; 
  streakToPreserve: number;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
        <div className="text-4xl mb-4">
          🌿
        </div>
        <h2 className="text-xl font-semibold mb-2">Use Grace Token?</h2>
        <p className="text-gray-600 mb-6">
          This will preserve your {streakToPreserve}-day streak. 
          No shame, just grace.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl font-medium text-white"
            style={{ backgroundColor: COLORS.sage }}
          >
            Yes, Use Grace
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-medium text-gray-600 bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Kindness Break Modal Component
function KindnessBreakModal({
  onConfirm,
  onCancel,
  currentStreak,
}: {
  onConfirm: (days?: number) => void;
  onCancel: () => void;
  currentStreak: number;
}) {
  const [selectedDays, setSelectedDays] = useState<number | undefined>(3);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">
            🌸
          </div>
          <h2 className="text-xl font-semibold mb-2">Take a Kindness Break</h2>
          <p className="text-gray-600">
            Your {currentStreak}-day streak will be preserved. 
            Rest is part of healing.
          </p>
        </div>

        <div className="space-y-2 mb-4">
          {[3, 7, 14, undefined].map((days) => (
            <button
              key={days ?? 'indefinite'}
              onClick={() => setSelectedDays(days)}
              className={`
                w-full py-3 px-4 rounded-xl text-left transition-all
                ${selectedDays === days 
                  ? 'bg-[#a4b792]/20 border-2 border-[#a4b792]' 
                  : 'bg-gray-50 border-2 border-transparent'
                }
              `}
            >
              <span className="font-medium">
                {days ? `${days} days` : 'As long as I need'}
              </span>
            </button>
          ))}
        </div>
        
        <p className="text-xs text-gray-500 mb-4 text-center">
          When you return, you'll earn 1.5x XP as a welcome back gift.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={() => onConfirm(selectedDays)}
            className="w-full py-4 rounded-xl font-medium text-white"
            style={{ backgroundColor: COLORS.terracotta }}
          >
            Begin Rest
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-4 rounded-xl font-medium text-gray-600 bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}