import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repo = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(repo, relativePath), 'utf8');
}

test('footer navigation uses the canonical app routes', () => {
  const footerNav = read('src/components/ui/FooterNav.tsx');

  for (const route of ['/dashboard', '/journal', '/containers', '/insights', '/settings']) {
    assert.match(footerNav, new RegExp(`href: '${route}'`));
  }

  assert.match(footerNav, /<Link/);
  assert.match(footerNav, /aria-label="Primary navigation"/);
  assert.match(footerNav, /aria-current=\{active \? 'page' : undefined\}/);
  assert.doesNotMatch(footerNav, /window\.location|location\.assign|location\.replace|useSafeNavigation/);
});

test('internal navigation no-ops active tabs and prevents concurrent route pushes', () => {
  const source = read('src/hooks/useInternalNavigation.ts');

  assert.match(source, /if \(currentRoute === targetRoute\)/);
  assert.match(source, /same_route_noop/);
  assert.match(source, /pendingRouteRef/);
  assert.match(source, /pendingStartedAtRef/);
  assert.match(source, /duplicate_route_noop/);
  assert.match(source, /transition_in_flight/);
  assert.match(source, /else if \(pendingRoute === targetRoute\)/);
  assert.match(source, /recordInternalNavigationTap\(route, options, 'transition_in_flight'\)/);
  assert.match(source, /logNavigationDiagnostic\(route, options, 'transition_in_flight'\)/);
  assert.doesNotMatch(source, /pendingRoute === targetRoute \? 'duplicate_route_noop' : 'transition_in_flight'/);
  assert.doesNotMatch(source, /recordInternalNavigationTap\(pendingRoute, \{ source: 'internal_navigation' \}, 'transition_in_flight'\)/);
  assert.match(source, /INTERNAL_NAVIGATION_LOCK_MS/);
  assert.match(source, /INTERNAL_NAVIGATION_STALE_LOCK_MS/);
  assert.match(source, /logNavigationDiagnostic/);
  assert.match(source, /clearPendingNavigation/);
  assert.match(source, /router\.push\(route\)/);
  assert.match(source, /finally/);
  assert.match(source, /visibilitychange/);
  assert.match(source, /pagehide/);
  assert.match(source, /pageshow/);
  assert.match(source, /window\.addEventListener\('blur'/);
  assert.match(source, /window\.addEventListener\('focus'/);
  assert.match(source, /clearPendingNavigation\('transition_released'\);/);
  assert.doesNotMatch(source, /window\.location|location\.assign|location\.replace|safeWindow\.open|['_"]_self['_"]/);
});

test('settings remains allowed through root gating and crisis access remains present', () => {
  const root = read('src/app/layout.tsx');
  const crisis = read('src/components/CrisisFooter.tsx');

  assert.match(root, /<FooterNav \/>/);
  assert.match(root, /<CrisisFooter \/>/);
  assert.match(crisis, /tel:988/);
  assert.match(crisis, /Call 988 Suicide and Crisis Lifeline/);
});

test('transient page transitions do not intercept bottom navigation taps', () => {
  const transition = read('src/components/ui/PageTransition.tsx');
  const crisisModal = read('src/components/CrisisModal.tsx');

  assert.match(transition, /opacity: visible \? 1 : 0/);
  assert.doesNotMatch(transition, /pointerEvents/);
  assert.match(crisisModal, /zIndex: 90/);
});
