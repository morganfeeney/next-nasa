module.exports = {
  extends: [
    'next',
    'next/core-web-vitals',
    'prettier',
    'plugin:react/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@next/next/no-img-element': 0,
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 'off',
    'no-else-return': ['error', { allowElseIf: true }],
    'prettier/prettier': ['error', { singleQuote: true }],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
      },
    ],
  },
};
