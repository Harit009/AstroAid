/**
 * jest.setup.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Runs AFTER the Jest testing framework is installed in the environment.
 * Extends expect() with @testing-library/jest-dom matchers and applies
 * global browser API polyfills that jsdom doesn't implement natively.
 */

// ── 1. Jest-DOM custom matchers ───────────────────────────────────────────────
// Adds: toBeInTheDocument, toHaveTextContent, toBeVisible, toBeDisabled, etc.
import "@testing-library/jest-dom";

// ── 2. ResizeObserver polyfill ────────────────────────────────────────────────
// EarthSystemsMonitor uses ResizeObserver to track the globe container size.
// jsdom doesn't implement it, so we provide a jest.fn() mock.
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// ── 3. IntersectionObserver polyfill ─────────────────────────────────────────
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: "",
  thresholds: [],
}));

// ── 4. window.matchMedia polyfill ────────────────────────────────────────────
// Framer Motion and some Tailwind utilities query media features.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// ── 5. Suppress console.error for known React 19 noise ───────────────────────
// React 19 logs "Warning: act(...)" warnings during async state updates.
// We selectively silence them to keep test output readable.
const originalConsoleError = console.error;
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((...args) => {
    const message = args[0]?.toString() ?? "";
    const suppressedPatterns = [
      "Warning: ReactDOM.render is no longer supported",
      "Warning: An update to",
      "Error: Not implemented: HTMLCanvasElement.prototype.getContext",
    ];
    if (suppressedPatterns.some((p) => message.includes(p))) return;
    originalConsoleError(...args);
  });
});

afterAll(() => {
  console.error.mockRestore?.();
});

// ── 6. Clear all mocks between tests ─────────────────────────────────────────
afterEach(() => {
  jest.clearAllMocks();
});
