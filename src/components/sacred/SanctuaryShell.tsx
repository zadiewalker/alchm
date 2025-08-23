// ALCHM Sacred Component: SanctuaryShell
// Sacred container that holds the entire healing experience
// Replaces: Layout

import React from 'react';

export interface SanctuaryShellProps {
  children: React.ReactNode;
  energyLevel?: 'gentle' | 'presence' | 'ceremony' | 'ritual';
  consciousness?: 'grounding' | 'opening' | 'integrating' | 'celebrating';
  sacredSpace?: boolean;
  className?: string;
}

export function SanctuaryShell({
  children,
  energyLevel = 'gentle',
  consciousness = 'grounding',
  sacredSpace = true,
  className = ''
}: SanctuaryShellProps) {
  const shellClasses = [
    'sanctuary-shell',
    `energy-${energyLevel}`,
    `consciousness-${consciousness}`,
    sacredSpace && 'sacred-space',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={shellClasses} role="main" aria-label="Sacred Sanctuary">
      <div className="sanctuary-inner">
        {children}
      </div>
      {sacredSpace && (
        <div className="sacred-aura" aria-hidden="true" />
      )}
    </div>
  );
}

// Sacred Shell with Crown Chakra (Header) and Grounding Roots (Footer)
export interface CompletesanctuaryProps extends SanctuaryShellProps {
  crownChakra?: React.ReactNode;
  groundingRoots?: React.ReactNode;
  wisdomWing?: React.ReactNode;
}

export function CompleteSanctuary({
  children,
  crownChakra,
  groundingRoots,
  wisdomWing,
  ...shellProps
}: CompletesanctuaryProps) {
  return (
    <SanctuaryShell {...shellProps}>
      {crownChakra && (
        <header className="crown-chakra" role="banner">
          {crownChakra}
        </header>
      )}
      
      <div className="sanctuary-body">
        {wisdomWing && (
          <aside className="wisdom-wing" role="complementary">
            {wisdomWing}
          </aside>
        )}
        
        <main className="sacred-content" role="main">
          {children}
        </main>
      </div>
      
      {groundingRoots && (
        <footer className="grounding-roots" role="contentinfo">
          {groundingRoots}
        </footer>
      )}
    </SanctuaryShell>
  );
}

export default SanctuaryShell;