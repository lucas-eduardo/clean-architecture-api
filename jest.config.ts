import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  roots: [
    '<rootDir>/src'
  ],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFiles: ['dotenv/config']
}

export default config
