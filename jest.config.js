const nextJest = require('next/jest')

// AIDEV-NOTE: Jest configuration for Next.js with TypeScript and React Testing Library
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// AIDEV-NOTE: Helper function for test type filtering
function getTestTypePattern(testType) {
  const patterns = {
    unit: '(utils|math|validation|semantic|simplex).*test',
    integration: '(hooks|integration|manager|context|preset).*test',
    behavioral: '(layout|workflow|tour|educational|page).*test',
    component: '(ui|button|theme|checkbox|header|canvas|generator).*test'
  }
  return patterns[testType] || undefined
}

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  // AIDEV-NOTE: Test type filtering removed from config - now handled via command-line args
  moduleNameMapper: {
    // Handle module aliases (if you use them in your Next.js app)
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    // AIDEV-NOTE: Mock markdown dependencies for testing since they're ESM-only
    '^react-markdown$': '<rootDir>/src/__mocks__/react-markdown.tsx',
    '^remark-gfm$': '<rootDir>/src/__mocks__/remark-gfm.js',
    '^rehype-highlight$': '<rootDir>/src/__mocks__/rehype-highlight.js',
    // Mock highlight.js CSS import
    '^highlight\\.js/styles/github-dark\\.css$': '<rootDir>/src/__mocks__/empty-css.js',
  },
  collectCoverageFrom: [
    'src/components/**/*.{js,jsx,ts,tsx}',
    'src/lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)