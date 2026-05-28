import type { CSSProperties, JSX } from 'react';
import {
  APP_STORE_EXPORT_PROFILES,
  APP_STORE_SCREENSHOTS,
} from '@/config/marketing/appStoreScreenshots';
import { AppStoreScreenshotFrame } from '@/components/marketing/AppStoreScreenshotFrame';

// ALCHM_IDENTITY_ROLE: utility-screen

export const metadata = {
  title: 'ALCHM App Store Screenshots',
  description: 'Export-ready App Store screenshot layouts for ALCHM.',
};

export default function AppStoreScreenshotsPage(): JSX.Element {
  return (
    <main
      style={{
        minHeight: '100dvh',
        padding: '48px 24px 80px',
        background: 'var(--gradient-marketing-screen)',
      }}
    >
      <section
        style={{
          maxWidth: '1500px',
          margin: '0 auto 40px',
          padding: '28px 32px',
          borderRadius: '28px',
          background: 'var(--surface-elevated)',
          border: '1px solid var(--surface-marketing-strong)',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        <h1
          style={{
            margin: '0 0 8px',
            fontFamily: 'var(--font-display)',
            fontSize: '44px',
            fontWeight: 300,
            lineHeight: 1.08,
            color: 'var(--color-text-primary)',
          }}
        >
          App Store screenshot system
        </h1>
        <p
          style={{
            margin: '0 0 16px',
            maxWidth: '760px',
            fontFamily: 'var(--font-ui)',
            fontSize: '16px',
            lineHeight: 1.5,
            color: 'var(--color-text-secondary)',
          }}
        >
          Clean screenshot crop on a quiet ALCHM field. Each frame uses one real app
          screen, a restrained headline, and enough empty space to keep the UI truthful.
        </p>
        <div style={infoRowStyle}>
          {APP_STORE_EXPORT_PROFILES.map((exportProfile) => (
            <p key={exportProfile.id} style={metaPillStyle}>
              {exportProfile.label}: {exportProfile.width}×{exportProfile.height}
            </p>
          ))}
        </div>
      </section>

      {APP_STORE_EXPORT_PROFILES.map((profile) => (
        <section
          key={profile.id}
          aria-label={`ALCHM App Store screenshots for ${profile.label}`}
          style={{
            display: 'grid',
            justifyItems: 'center',
            gap: '40px',
            marginBottom: '56px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '1500px',
              margin: '0 auto',
            }}
          >
            <h2
              style={{
                margin: '0 0 16px',
                fontFamily: 'var(--font-display)',
                fontSize: '32px',
                fontWeight: 300,
                lineHeight: 1.08,
                color: 'var(--color-text-primary)',
              }}
            >
              {profile.label}
            </h2>
          </div>
          {APP_STORE_SCREENSHOTS.map((screenshot) => (
            <AppStoreScreenshotFrame
              key={`${profile.id}-${screenshot.id}`}
              profile={profile}
              screenshot={screenshot}
            />
          ))}
        </section>
      ))}
    </main>
  );
}

const infoRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  alignItems: 'center',
};

const metaPillStyle: CSSProperties = {
  margin: 0,
  padding: '10px 14px',
  borderRadius: '999px',
  border: '1px solid var(--surface-marketing-strong)',
  background: 'var(--surface-marketing-soft)',
  fontFamily: 'var(--font-ui)',
  fontSize: '13px',
  lineHeight: 1.2,
  color: 'var(--color-text-secondary)',
};
