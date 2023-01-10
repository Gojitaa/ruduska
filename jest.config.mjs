/** @type {import('ts-jest').JestConfigWithTsJest} */

export default {
    preset: "ts-jest",
    coverageReporters: ["json-summary", "text"],
    testEnvironment: "node",
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 0
        }
    }
}
