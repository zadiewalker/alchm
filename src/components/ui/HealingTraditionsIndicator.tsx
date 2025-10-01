/**
 * Simple Healing Traditions Indicator
 */

import React from 'react';

interface HealingTraditionsIndicatorProps {
  variant?: string;
}

export default function HealingTraditionsIndicator({ variant }: HealingTraditionsIndicatorProps) {
  return (
    <div className="text-center text-white/60 text-sm">
      <p>Honoring all healing traditions & wisdom</p>
    </div>
  );
}