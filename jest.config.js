module.exports = {
  verbose: true,
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['<rootDir>/cache/', '<rootDir>/node_modules/'],
  transformIgnorePatterns: [],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/pages/**'],
};
