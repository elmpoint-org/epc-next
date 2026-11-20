import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...nextVitals,
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.open-next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'sst-env.d.ts',
      'graphql-schema.d.ts',
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  },
  {
    // compiler-based rules warn until effects are reviewed for react compiler
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/set-state-in-render': 'warn',
      'react-hooks/purity': 'warn',
    },
  },
];

export default eslintConfig;
