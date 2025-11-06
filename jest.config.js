export default {
  testEnvironment: "jsdom", 
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['js','jsx','json','node'],
  transformIgnorePatterns: ['/node_modules/'],
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
  ],
  coveragePathIgnorePatterns: [
    "<rootDir>/src/main\\.jsx$",
    "<rootDir>/src/Routes\\.jsx$",
  ]
};