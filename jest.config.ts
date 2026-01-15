import type { Config } from 'jest';

const config: Config = {

  preset: 'ts-jest',

  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '^@ui$': '<rootDir>/src/components/ui',
    '^@components$': '<rootDir>/src/components',

  },

  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}],
  },
};

export default config;