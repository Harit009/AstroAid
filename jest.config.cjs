/** @type {import('jest').Config} */
module.exports = {
  // ── Environment ──────────────────────────────────────────────────────────────
  testEnvironment: "jest-environment-jsdom",

  // ── Transpilation ─────────────────────────────────────────────────────────────
  // @swc/jest: ~10x faster than babel-jest, handles JSX + ESM seamlessly
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "ecmascript", jsx: true },
          transform: { react: { runtime: "automatic" } },
        },
        module: { type: "commonjs" },
      },
    ],
  },

  // ── Module Resolution Mocks ───────────────────────────────────────────────────
  moduleNameMapper: {
    // @/* path alias — mirrors jsconfig.json
    "^@/(.*)$": "<rootDir>/src/$1",
    // CSS modules → identity-obj-proxy returns class name strings
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    // Plain CSS imports → empty object
    "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
    // Static file assets (images, fonts, etc.) → stub string
    "^.+\\.(jpg|jpeg|png|gif|svg|webp|ico|woff|woff2|eot|ttf|otf)$":
      "<rootDir>/__mocks__/fileMock.js",
    // next/dynamic → synchronous HOC shim for jsdom
    "^next/dynamic$": "<rootDir>/__mocks__/nextDynamic.js",
    // next/navigation hooks → jest.fn() doubles
    "^next/navigation$": "<rootDir>/__mocks__/nextNavigation.js",
    // next/image → plain <img> tag
    "^next/image$": "<rootDir>/__mocks__/nextImage.js",
  },

  // ── Setup Files ───────────────────────────────────────────────────────────────
  // Runs BEFORE the test framework: patches HTMLCanvasElement & WebGLRenderingContext
  setupFiles: ["jest-canvas-mock"],
  // Runs AFTER the test framework: installs jest-dom matchers + browser API polyfills
  setupFilesAfterFramework: ["<rootDir>/jest.setup.js"],

  // ── Test Discovery ────────────────────────────────────────────────────────────
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.[jt]s?(x)",
    "<rootDir>/src/**/*.{spec,test}.[jt]s?(x)",
    "<rootDir>/__tests__/**/*.[jt]s?(x)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/e2e/"],

  // ── Coverage ──────────────────────────────────────────────────────────────────
  collectCoverageFrom: [
    "src/components/**/*.{js,jsx}",
    "src/app/**/*.{js,jsx}",
    "!src/**/*.test.{js,jsx}",
    "!src/**/__tests__/**",
    "!src/app/layout.jsx",
    "!src/app/template.jsx",
  ],
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: { branches: 70, functions: 80, lines: 80, statements: 80 },
  },

  // ── ESM in node_modules ───────────────────────────────────────────────────────
  // Force-transform ESM-only packages so Jest (CommonJS) can consume them
  transformIgnorePatterns: [
    "/node_modules/(?!(three|d3-.*)/)",
  ],

  testTimeout: 10000,
  verbose: true,
};
