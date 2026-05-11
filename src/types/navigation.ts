export type StaticRoutePath =
  | '/'
  | '/dashboard'
  | '/containers'
  | '/journal'
  | '/journal/new'
  | '/entry/new'
  | '/mirror'
  | '/settings'
  | '/settings/disclaimer'
  | '/onboarding'
  | '/paywall'
  | '/privacy'
  | '/privacy-policy'
  | '/support'
  | '/terms'
  | '/welcome'
  | '/upgrade'
  | '/export'
  | '/exports'
  | '/auth/create'
  | '/auth/signin'
  | '/auth/reset'
  | '/emergency'
  | '/transparency';

export type ContainerRoutePath =
  | `/containers/${string}`
  | `/containers/${string}/opening`
  | `/containers/${string}/ritual`
  | `/containers/${string}/today`
  | `/containers/${string}/threshold`
  | `/containers/${string}/arc`
  | `/containers/${string}/ceremony`
  | `/containers/${string}/day/${string}`;

export type RoutePath = StaticRoutePath | ContainerRoutePath;

export type BackNavigationConfig = {
  fallback: RoutePath;
};
