import js from '@eslint/js';

export default [
  {
    ignores: [
      '.next/**',
      '.next*/**',
      'out/**',
      'out*/**',
      'out 2/**',
      'alchm-v2/**',
      'alchm-vite/**',
      'alchm-clean/**',
      '_quarantine/**',
      'backups/**',
      'emergency-backups/**',
      'ios_backup_broken/**',
      'node_modules_corrupt_backup/**',
      'node_modules/**',
      '**/node_modules/**',
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
      'tailwind.config 2.js',
    ],
  },
  {
    languageOptions: {
      globals: {
        URL: 'readonly',
        __dirname: 'readonly',
        console: 'readonly',
        global: 'readonly',
        module: 'readonly',
        process: 'readonly',
      },
    },
  },
  js.configs.recommended,
];
