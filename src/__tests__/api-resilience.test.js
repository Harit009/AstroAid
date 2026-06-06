/**
 * api-resilience.test.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Integration-level tests for network resilience, timeout handling,
 * and rate-limit (HTTP 429) recovery logic.
 *
 * These tests validate a fetchWithResilience utility (created below in
 * src/lib/fetchWithResilience.js) that wraps all outbound API calls in
 * AstroAid (NASA APOD, NASA image search, OpenWeatherMap, etc.)
 *
 * Strategy:
 *  - We mock global.fetch with jest.fn() to simulate specific network conditions.
 *  - We use jest.useFakeTimers() to fast-forward AbortController timeouts and
 *    exponential back-off delays without waiting real wall-clock time.
 *  - Each test is hermetically isolated — no shared state leaks between cases.
 */

import {
  fetchWithResilience,
  DEFAULT_TIMEOUT_MS,
  MAX_RETRIES,
} from "../../lib/fetchWithResilience";

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

  it("passes the correct URL to fetch", async () => {
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
// SUITE 2 — TIMEOUT HANDLING (> 5000ms server non-response)
// ─────────────────────────────────────────────────────────────────────────────
describe("fetchWithResilience — Timeout (server takes > 5000ms)", () => {
  it("rejects with a TimeoutError when the server doesn't respond within DEFAULT_TIMEOUT_MS", async () => {
    // Simulate a fetch that never resolves — server hangs indefinitely
    global.fetch.mockImplementationOnce(
      (_url, { signal }) =>
        new Promise((_resolve, reject) => {
          // Respect the AbortSignal so our timeout can cancel the request
          signal.addEventListener("abort", () => {
            reject(new DOMException("The user aborted a request.", "AbortError"));
          });
          // Never resolve — simulates a hung server connection
        })
    );

    const fetchPromise = fetchWithResilience("https://api.openweathermap.org/data", {
      timeout: DEFAULT_TIMEOUT_MS, // 5000ms
    });

    // Fast-forward the fake timers past the timeout threshold
    jest.advanceTimersByTime(DEFAULT_TIMEOUT_MS + 100);

    await expect(fetchPromise).rejects.toMatchObject({
      name: expect.stringMatching(/AbortError|TimeoutError/),
    });
  });

  it("throws within the configured custom timeout (2000ms override)", async () => {
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

    jest.advanceTimersByTime(2100);

    await expect(fetchPromise).rejects.toMatchObject({ name: "AbortError" });
  });

  it("succeeds if the response arrives just before the timeout deadline", async () => {
    const fastPayload = { status: "ok" };

    global.fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          // Resolve just within the 5000ms window
          setTimeout(
            () => resolve({ ok: true, status: 200, json: async () => fastPayload }),
            4800
          );
        })
    );

    const fetchPromise = fetchWithResilience("https://api.example.com/fast", {
      timeout: DEFAULT_TIMEOUT_MS,
    });

    jest.advanceTimersByTime(4900);

    const result = await fetchPromise;
    expect(result).toEqual(fastPayload);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 3 — HTTP 429 RATE LIMITING (Exponential Back-Off Retry)
// ─────────────────────────────────────────────────────────────────────────────
describe("fetchWithResilience — HTTP 429 Rate Limiting with Back-Off Retry", () => {
  it("retries after receiving HTTP 429 and eventually resolves on success", async () => {
    const successPayload = { data: "recovered" };

    // First call → 429, second call → 200
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

    // Advance past the retry back-off delay (1000ms base)
    jest.advanceTimersByTime(1500);

    const result = await fetchPromise;
    expect(result).toEqual(successPayload);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("throws a RateLimitError after exhausting all retries on persistent 429s", async () => {
    // Every call returns 429
    global.fetch.mockResolvedValue({
      ok: false,
      status: 429,
      headers: { get: () => null },
      json: async () => ({ error: "Too Many Requests" }),
    });

    const fetchPromise = fetchWithResilience("https://api.openweathermap.org/throttled", {
      maxRetries: MAX_RETRIES,
    });

    // Advance timers past all back-off intervals (1s, 2s, 4s = 7s total for 3 retries)
    jest.advanceTimersByTime(10_000);

    await expect(fetchPromise).rejects.toThrow(/rate limit|429|too many requests/i);
    // Should have tried 1 initial + MAX_RETRIES = MAX_RETRIES + 1 total calls
    expect(global.fetch).toHaveBeenCalledTimes(MAX_RETRIES + 1);
  });

  it("respects the Retry-After header for the back-off delay", async () => {
    const successPayload = { ok: true };

    // 429 with a 3-second Retry-After, then success
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

    // Advance LESS than 3 seconds — should still be waiting
    jest.advanceTimersByTime(2000);
    expect(global.fetch).toHaveBeenCalledTimes(1); // Only initial call so far

    // Now advance past the Retry-After window
    jest.advanceTimersByTime(1500);

    const result = await fetchPromise;
    expect(result).toEqual(successPayload);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("does NOT retry on HTTP 401 Unauthorized (non-retriable status)", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "Unauthorized" }),
    });

    const fetchPromise = fetchWithResilience("https://api.openweathermap.org/protected");
    jest.advanceTimersByTime(10_000);

    await expect(fetchPromise).rejects.toThrow(/401|unauthorized/i);
    // Should NOT retry — only 1 call made
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("does NOT retry on HTTP 404 Not Found", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: "Not Found" }),
    });

    const fetchPromise = fetchWithResilience("https://api.nasa.gov/nonexistent");
    jest.advanceTimersByTime(10_000);

    await expect(fetchPromise).rejects.toThrow(/404|not found/i);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("retries on HTTP 500 Internal Server Error (transient server fault)", async () => {
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

    jest.advanceTimersByTime(2000);

    const result = await fetchPromise;
    expect(result).toEqual(recoveredPayload);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 4 — NETWORK ERROR (Offline / Connection Refused)
// ─────────────────────────────────────────────────────────────────────────────
describe("fetchWithResilience — Network Errors (Offline)", () => {
  it("throws a NetworkError when fetch rejects with a TypeError (offline)", async () => {
    global.fetch.mockRejectedValueOnce(
      new TypeError("Failed to fetch")
    );

    const fetchPromise = fetchWithResilience("https://api.nasa.gov/apod");
    jest.advanceTimersByTime(10_000);

    await expect(fetchPromise).rejects.toThrow(/Failed to fetch|network/i);
  });

  it("retries up to MAX_RETRIES times on consecutive network failures", async () => {
    global.fetch.mockRejectedValue(new TypeError("Failed to fetch"));

    const fetchPromise = fetchWithResilience("https://api.openweathermap.org/data", {
      maxRetries: MAX_RETRIES,
    });

    jest.advanceTimersByTime(15_000);

    await expect(fetchPromise).rejects.toBeDefined();
    expect(global.fetch).toHaveBeenCalledTimes(MAX_RETRIES + 1);
  });
});
