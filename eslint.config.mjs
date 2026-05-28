import js from '@eslint/js';

export default [
  {
    ignores: [
      '.next/**',
      'out/**',
      'out 2/**',
      'node_modules/**',
      'functions/**',
      'ios/**',
      'scripts/**',
      '**/*.ts',
      '**/*.tsx',
      'debug_localstorage.js',
      'test_localStorage.js',
      'next.config.js',
      'next.config 2.js',
      'postcss.config.js',
      'tailwind.config.js',
    ],
  },
  js.configs.recommended,
  {
    files: ['src/__tests__/**/*.mjs'],
    languageOptions: {
      globals: {
        global: 'readonly',
        process: 'readonly',
        URL: 'readonly',
      },
    },
  },
];
