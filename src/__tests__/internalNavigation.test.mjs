import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const repo = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(repo, relativePath), 'utf8');
}

test('footer tabs use one centralized internal navigation path', () => {
  const tabBar = read('src/components/shell/TabBar.tsx');
  const routes = read('src/utils/navigation.ts');

  assert.match(tabBar, /useInternalNavigation/);
  assert.match(tabBar, /type="button"/);
  assert.match(tabBar, /onClick=\{\(\) => navigate\(tab\.path/);
  assert.doesNotMatch(tabBar, /href=/);
  assert.doesNotMatch(tabBar, /window\.location|location\.assign|location\.replace|useSafeNavigation/);
  assert.match(routes, /\{ id: 'settings', label: 'Settings', path: '\/settings' \}/);
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
  const root = read('src/app/RootLayoutClient.tsx');
  const shell = read('src/components/shell/AppShell.tsx');
  const crisis = read('src/components/shell/CrisisFooter.tsx');

  assert.match(root, /pathname\?\.startsWith\('\/settings'\)/);
  assert.match(shell, /<TabBar \/>/);
  assert.match(shell, /<CrisisFooter onPress=\{\(\) => setCrisisOpen\(true\)\} \/>/);
  assert.match(crisis, /Resources/);
  assert.match(crisis, /pointerEvents: 'auto'/);
});

test('non-footer overlays cannot permanently intercept bottom navigation taps', () => {
  const prompt = read('src/components/notifications/NotificationPermissionPrompt.tsx');
  const transition = read('src/components/ui/PageTransition.tsx');
  const crisisModal = read('src/components/shell/CrisisModal.tsx');
  const globals = read('src/app/globals.css');

  assert.match(prompt, /pointerEvents: 'none'/);
  assert.match(prompt, /pointerEvents: 'auto'/);
  assert.match(prompt, /zIndex: 80/);
  assert.match(transition, /pointerEvents: visible \? 'auto' : 'none'/);
  assert.match(crisisModal, /pointerEvents: 'auto'/);
  assert.match(globals, /\.confirm-sheet-backdrop[\s\S]*pointer-events: auto;/);
  assert.match(globals, /\.confirm-sheet-panel[\s\S]*pointer-events: auto;/);
});
