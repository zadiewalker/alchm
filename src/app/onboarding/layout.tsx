export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ['--tab-bar-display' as string]: 'none' }}>
      {children}
    </div>
  );
}
