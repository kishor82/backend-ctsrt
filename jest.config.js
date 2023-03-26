module.exports = {
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  testRegex: '(<rootDir>/src/tests/.*|(\\.|/)(test|spec))\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverage: true,
  coverageReporters: [['text', { skipFull: true }]],
  collectCoverageFrom: [
    'src/controllers/**/*.ts',
    '!**/*/index.*',
    '!src/data_access/**/*',
    '!src/tests/**/*',
    '!src/models/**/*',
    '!src/plugins/**/*',
  ],
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
};
