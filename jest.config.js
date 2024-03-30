const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
    clearMocks: true,
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/prisma-mock.ts'],
    moduleDirectories: ["node_modules", "<rootDir>/src/"],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        'next-auth/(.*)$': '<rootDir>/node_modules/$1',
    },
    transform: {
        "^.+\\.(ts|js)x?$": "babel-jest",
    },
    moduleFileExtensions: ["js","jsx", "ts", "tsx"],
    collectCoverage: true,
    coverageReporters: ["html", "text"],
    coverageDirectory: "coverage"
}

module.exports = createJestConfig(customJestConfig)
