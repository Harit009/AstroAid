// __mocks__/nextNavigation.js
// Provides test doubles for all next/navigation hooks used in the app.

const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  pathname: "/",
  query: {},
}));

const useSearchParams = jest.fn(() => ({
  get: jest.fn((key) => null),
  getAll: jest.fn(() => []),
  has: jest.fn(() => false),
  toString: jest.fn(() => ""),
}));

const usePathname = jest.fn(() => "/");

const useParams = jest.fn(() => ({}));

module.exports = {
  useRouter,
  useSearchParams,
  usePathname,
  useParams,
};
