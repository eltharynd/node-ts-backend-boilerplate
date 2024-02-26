module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  testMatch: ['**/**/*.test.ts'],
  coverageDirectory: '../coverage',
  verbose: true,
  forceExit: true,
}
