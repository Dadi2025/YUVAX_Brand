export default {
    testEnvironment: 'node',
    transform: {}, // Disable transformation for ESM
    verbose: true,
    testMatch: ['**/tests/**/*.test.js'],
    forceExit: true, // Force exit after tests complete (useful for Mongoose connections)
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true
};
