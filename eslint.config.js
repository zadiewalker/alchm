import next from 'eslint-config-next';

export default [
  ...next,
  {
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
    },
  },
];
