/**
 * api-resilience.test.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Integration-level tests for network resilience, timeout handling,
 * and rate-limit (HTTP 429) recovery logic.
 *
 * Strategy:
 *  - global.fetch is replaced with jest.fn() to simulate network conditions.
 *  - jest.useFakeTimers() + jest.runAllTimersAsync() drains both the macrotask
 *    queue (setTimeout) AND the Promise microtask queue — required for Jest 30.
 *  - Each test is hermetically isolated with beforeEach / afterEach resets.
 */

import {
  fetchWithResilience,
  DEFAULT_TIMEOUT_MS,
  MAX_RETRIES,
} from "../lib/fetchWithResilience";

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL SETUP
// ─────────────────────────────────────────────────────────────────────────────
beforeEach(() => {
  jest.useFakeTimers();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.useRealTimers();
  jest.resetAllMocks();
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 1 — HAPPY PATH
// ─────────────────────────────────────────────────────────────────────────────
describe("fetchWithResilience — Happy Path", () => {
  it("returns parsed JSON on a successful 200 response", async () => {
    const mockPayload = { title: "Andromeda Galaxy", explanation: "Far away." };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockPayload,
    });

    const result = await fetchWithResilience("https://api.nasa.gov/apod");
    expect(result).toEqual(mockPayload);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("passes the correct URL and AbortSignal to fetch", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    await fetchWithResilience("https://api.nasa.gov/planetary/apod?api_key=TEST");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.nasa.gov/planetary/apod?api_key=TEST",
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 2 — TIMEOUT HANDLING
// The AbortController fires after timeout ms. The mock fetch listens on the
// AbortSignal and rejects with AbortError — this is the expected behaviour.
// ─────────────────────────────────────────────────────────────────────────────
describe("fetchWithResilience — Timeout (server takes > DEFAULT_TIMEOUT_MS)", () => {
  it("rejects with AbortError when the server does not respond within DEFAULT_TIMEOUT_MS", async () => {
    global.fetch.mockImplementationOnce(
      (_url, { signal }) =>
        new Promise((_resolve, reject) => {
          signal.addEventListener("abort", () => {
            reject(new DOMException("The user aborted a request.", "AbortError"));
          });
        })
    );

    const fetchPromise = fetchWithResilience("https://api.openweathermap.org/data", {
      timeout: DEFAULT_TIMEOUT_MS,
    });

    // Bind the rejection assertion BEFORE advancing timers so Jest tracks the
    // promise — this prevents the AbortError being treated as unhandled.
    const assertion = expect(fetchPromise).rejects.toMatchObject({
      name: expect.stringMatching(/AbortError|TimeoutError/),
    });
    await jest.runAllTimersAsync();
    await assertion;
  });

  it("rejects within a custom 2000ms timeout override", async () => {
    global.fetch.mockImplementationOnce(
      (_url, { signal }) =>
        new Promise((_resolve, reject) => {
          signal.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
        })
    );

    const fetchPromise = fetchWithResilience("https://api.example.com/slow", {
      timeout: 2000,
    });

    const assertion = expect(fetchPromise).rejects.toMatchObject({ name: "AbortError" });
    await jest.runAllTimersAsync();
    await assertion;
  });

  it("succeeds if the response arrives just before the timeout deadline", async () => {
    const fastPayload = { status: "ok" };

    global.fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () => resolve({ ok: true, status: 200, json: async () => fastPayload }),
            4800
          );
        })
    );

    const fetchPromise = fetchWithResilience("https://api.example.com/fast", {
      timeout: DEFAULT_TIMEOUT_MS,
    });

    await jest.runAllTimersAsync();

    const result = await fetchPromise;
    expect(result).toEqual(fastPayload);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 3 — HTTP 429 RATE LIMITING (Exponential Back-Off Retry)
// ─────────────────────────────────────────────────────────────────────────────
describe("fetchWithResilience — HTTP 429 Rate Limiting with Back-Off Retry", () => {
  it("retries after HTTP 429 and eventually resolves on success", async () => {
    const successPayload = { data: "recovered" };

    global.fetch
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: { get: (h) => (h === "Retry-After" ? "1" : null) },
        json: async () => ({ error: "Too Many Requests" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => successPayload,
      });

    const fetchPromise = fetchWithResilience("https://api.nasa.gov/rate-limited", {
      maxRetries: 2,
    });

    await jest.runAllTimersAsync();

    const result = await fetchPromise;
    expect(result).toEqual(successPayload);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("throws after exhausting all retries on persistent 429s", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 429,
      headers: { get: () => null },
      json: async () => ({ error: "Too Many Requests" }),
    });

    const fetchPromise = fetchWithResilience("https://api.openweathermap.org/throttled", {
      maxRetries: MAX_RETRIES,
    });

    // Bind assertion before timers fire to prevent unhandled rejection
    const assertion = expect(fetchPromise).rejects.toThrow(/429/);
    await jest.runAllTimersAsync();
    await assertion;
    expect(global.fetch).toHaveBeenCalledTimes(MAX_RETRIES + 1);
  });

  it("respects the Retry-After header for the back-off delay", async () => {
    const successPayload = { ok: true };

    global.fetch
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: { get: (h) => (h === "Retry-After" ? "3" : null) },
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => successPayload,
      });

    const fetchPromise = fetchWithResilience("https://api.nasa.gov/retry-after", {
      maxRetries: 1,
    });

    await jest.runAllTimersAsync();

    const result = await fetchPromise;
    expect(result).toEqual(successPayload);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("does NOT retry on HTTP 401 Unauthorized (non-retriable)", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({ error: "Unauthorized" }),
    });

    await expect(
      fetchWithResilience("https://api.openweathermap.org/protected")
    ).rejects.toThrow(/401|unauthorized/i);

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("does NOT retry on HTTP 404 Not Found", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({ error: "Not Found" }),
    });

    await expect(
      fetchWithResilience("https://api.nasa.gov/nonexistent")
    ).rejects.toThrow(/404|not found/i);

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("retries on HTTP 500 Internal Server Error (transient fault)", async () => {
    const recoveredPayload = { status: "recovered" };

    global.fetch
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Internal Server Error" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => recoveredPayload,
      });

    const fetchPromise = fetchWithResilience("https://api.nasa.gov/flaky", {
      maxRetries: 1,
    });

    await jest.runAllTimersAsync();

    const result = await fetchPromise;
    expect(result).toEqual(recoveredPayload);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 4 — NETWORK ERROR (Offline / Connection Refused)
// ─────────────────────────────────────────────────────────────────────────────
describe("fetchWithResilience — Network Errors (Offline)", () => {
  it("throws immediately when fetch rejects with a TypeError (maxRetries=0)", async () => {
    // With 0 retries, no back-off sleep needed — resolves synchronously
    global.fetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    await expect(
      fetchWithResilience("https://api.nasa.gov/apod", { maxRetries: 0 })
    ).rejects.toThrow(/Failed to fetch/i);

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("retries MAX_RETRIES times on consecutive network failures before throwing", async () => {
    for (let i = 0; i <= MAX_RETRIES; i++) {
      global.fetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    }

    const fetchPromise = fetchWithResilience("https://api.openweathermap.org/data", {
      maxRetries: MAX_RETRIES,
    });

    // Bind before timers to prevent unhandled rejection
    const assertion = expect(fetchPromise).rejects.toThrow(/Failed to fetch/i);
    await jest.runAllTimersAsync();
    await assertion;
    expect(global.fetch).toHaveBeenCalledTimes(MAX_RETRIES + 1);
  });
});
