import type { CSSProperties, JSX } from 'react';
import {
  APP_STORE_SCREENSHOT_TOKENS,
  type AppStoreExportProfile,
  type AppStoreScreenshotDefinition,
} from '@/config/marketing/appStoreScreenshots';

interface AppStoreScreenshotFrameProps {
  profile: AppStoreExportProfile;
  screenshot: AppStoreScreenshotDefinition;
}

export function AppStoreScreenshotFrame({
  profile,
  screenshot,
}: AppStoreScreenshotFrameProps): JSX.Element {
  const screenShellStyle: CSSProperties = {
    position: 'absolute',
    left: '50%',
    top: `${profile.screenshotTop}px`,
    transform: `translateX(-50%) translateY(${screenshot.screenshotOffsetY ?? '0px'})`,
    width: `${profile.screenshotWidth}px`,
    height: `${profile.screenshotHeight}px`,
    borderRadius: `${APP_STORE_SCREENSHOT_TOKENS.screenRadius}px`,
    overflow: 'hidden',
    background: 'var(--gradient-marketing-shell)',
    border: APP_STORE_SCREENSHOT_TOKENS.screenshotBorder,
    boxShadow: APP_STORE_SCREENSHOT_TOKENS.screenshotShadow,
  };

  return (
    <article
      data-export-name={`alchm-${profile.id}-${screenshot.id}`}
      style={{
        position: 'relative',
        width: `${profile.width}px`,
        height: `${profile.height}px`,
        overflow: 'hidden',
        borderRadius: '56px',
        background: APP_STORE_SCREENSHOT_TOKENS.background,
        boxShadow: 'var(--shadow-strong)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: `${profile.outerPadding}px`,
          borderRadius: '48px',
          background: APP_STORE_SCREENSHOT_TOKENS.surface,
          border: '1px solid var(--surface-marketing)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: `${profile.copyTop}px`,
          left: `${profile.outerPadding}px`,
          right: `${profile.outerPadding}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: `${APP_STORE_SCREENSHOT_TOKENS.textGap}px`,
          maxWidth: `${profile.copyMaxWidth}px`,
          zIndex: 1,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: APP_STORE_SCREENSHOT_TOKENS.bodyFamily,
            fontSize: '24px',
            fontWeight: 400,
            lineHeight: 1.25,
            letterSpacing: '0.03em',
            color: APP_STORE_SCREENSHOT_TOKENS.eyebrowColor,
          }}
        >
          ALCHM
        </p>
        <h2
          style={{
            margin: 0,
            fontFamily: APP_STORE_SCREENSHOT_TOKENS.headlineFamily,
            fontSize: '110px',
            fontWeight: 300,
            lineHeight: 1.02,
            letterSpacing: '-0.02em',
            color: APP_STORE_SCREENSHOT_TOKENS.headlineColor,
          }}
        >
          {screenshot.headline}
        </h2>
        <p
          style={{
            margin: 0,
            maxWidth: '680px',
            fontFamily: APP_STORE_SCREENSHOT_TOKENS.bodyFamily,
            fontSize: '34px',
            fontWeight: 400,
            lineHeight: 1.34,
            letterSpacing: '0.01em',
            color: APP_STORE_SCREENSHOT_TOKENS.sublineColor,
          }}
        >
          {screenshot.subline}
        </p>
      </div>

      <div style={screenShellStyle}>
        {screenshot.status === 'ready' && screenshot.imageSrc ? (
          <img
            src={screenshot.imageSrc}
            alt={screenshot.imageAlt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: screenshot.imageObjectPosition ?? 'center top',
              display: 'block',
            }}
          />
        ) : (
          <div
            aria-label={`Pending screenshot slot for ${screenshot.id}`}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '56px 52px',
              background: 'var(--gradient-marketing-screen)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '22%',
                borderRadius: '28px',
                background: 'var(--surface-marketing-card)',
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: APP_STORE_SCREENSHOT_TOKENS.headlineFamily,
                  fontSize: '56px',
                  lineHeight: 1.08,
                  color: APP_STORE_SCREENSHOT_TOKENS.headlineColor,
                }}
              >
                Add real ALCHM screen
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: APP_STORE_SCREENSHOT_TOKENS.bodyFamily,
                  fontSize: '26px',
                  lineHeight: 1.45,
                  color: APP_STORE_SCREENSHOT_TOKENS.sublineColor,
                }}
              >
                Preferred: {screenshot.preferredScreen}
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: APP_STORE_SCREENSHOT_TOKENS.bodyFamily,
                  fontSize: '22px',
                  lineHeight: 1.45,
                  color: APP_STORE_SCREENSHOT_TOKENS.noteColor,
                }}
              >
                Place image at {screenshot.assetPath} and set status to ready.
              </p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
