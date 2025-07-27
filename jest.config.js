module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  
  preset: undefined, 
  
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^next/image$': '<rootDir>/tests/__mocks__/nextImage.js',
    '^next/navigation$': '<rootDir>/tests/__mocks__/nextNavigation.js',
    // Add path mapping for absolute imports
    '^@/(.*)$': '<rootDir>/app/$1',
  },
  
  transform: {
    // Use babel-jest for better JSX/TSX transformation
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
    }],
  },
  
  transformIgnorePatterns: [
    '/node_modules/(?!(idb-keyval)/)',
  ],
  
  moduleDirectories: ['node_modules', '<rootDir>/app'],
  
  // Add file extensions Jest should handle
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Test file patterns
  testMatch: [
    '<rootDir>/tests/**/*.(test|spec).(ts|tsx|js|jsx)',
  ],
  
  // Collect coverage from source files
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/layout.tsx',
    '!app/**/loading.tsx',
    '!app/**/not-found.tsx',
  ],
};