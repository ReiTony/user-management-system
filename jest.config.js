require('dotenv').config({ path: './.env.test' });
module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './', // Set the root directory
  testRegex: '.*\\.spec\\.ts$', // Look for all .spec.ts files
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  setupFiles: ['dotenv/config'],
};