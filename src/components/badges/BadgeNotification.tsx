'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/lib/badges/export';
import { AVAILABLE_BADGES } from '@/lib/badges/service';

interface BadgeNotificationProps {
  badgeIds: string[];
  onDismiss: () => void;
  show: boolean;
}

export default function BadgeNotification({ badgeIds, onDismiss, show }: BadgeNotificationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show && badgeIds.length > 0) {
      setVisible(true);
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [show, badgeIds]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 300); // Wait for animation to complete
  };

  if (!visible || badgeIds.length === 0) return null;

  const badges = badgeIds.map(id => 
    AVAILABLE_BADGES.find(b => b.name.toLowerCase().replace(/\s+/g, '-') === id)
  ).filter(Boolean);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`transform transition-all duration-300 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className="bg-white border-2 border-[var(--sage)] rounded-2xl shadow-lg p-6 max-w-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">🏆</div>
            <div>
              <h3 className="font-medium text-[var(--sage)]">
                New Badge{badges.length > 1 ? 's' : ''} Earned!
              </h3>
              <p className="text-sm text-[var(--ink-mute)]">
                Congratulations on your achievement
              </p>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            {badges.map((badge) => badge && (
              <div key={badge.name} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--blush)]/30">
                <div className="w-10 h-10 rounded-full bg-[var(--sage)] flex items-center justify-center text-white font-medium text-sm">
                  {badge.category === 'presence' ? '🧘' : 
                   badge.category === 'reflection' ? '💭' :
                   badge.category === 'growth' ? '🌱' : '🤝'}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{badge.name}</div>
                  <div className="text-xs text-[var(--ink-mute)] capitalize">{badge.category}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-2 rounded-xl border border-[var(--line)] text-sm hover:bg-[var(--blush)]/30 transition-colors duration-base"
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                handleDismiss();
                // Navigate to badges page
                window.location.href = '/badges';
              }}
              className="flex-1 px-4 py-2 rounded-xl bg-[var(--sage)] text-white text-sm hover:opacity-95 transition-opacity duration-base"
            >
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}