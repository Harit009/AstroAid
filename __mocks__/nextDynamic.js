// __mocks__/nextDynamic.js
// Shims next/dynamic so SSR-disabled components are imported synchronously in tests.
// The real next/dynamic({ ssr: false }) defers loading; in jsdom we need eager require.

const React = require("react");

/**
 * @param {() => Promise<any>} importFn - The dynamic import factory, e.g. () => import('react-globe.gl')
 * @param {object} options            - next/dynamic options (ssr, loading, etc.)
 * @returns {React.ComponentType}     - A React component that renders immediately
 */
function dynamic(importFn, options) {
  // Return a wrapper component that renders a testable placeholder.
  const MockDynamicComponent = (props) =>
    React.createElement("div", {
      "data-testid": "dynamic-component-stub",
      ...props,
    });

  MockDynamicComponent.displayName = "NextDynamicStub";
  return MockDynamicComponent;
}

module.exports = dynamic;
module.exports.default = dynamic;
