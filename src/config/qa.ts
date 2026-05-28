const QA_BUILD_ENABLED =
  process.env.ALCHM_QA_ROUTES === '1' ||
  process.env.NEXT_PUBLIC_ALCHM_QA_ROUTES === '1';

export const QA_ROUTES_ENABLED = process.env.NODE_ENV !== 'production' || QA_BUILD_ENABLED;
