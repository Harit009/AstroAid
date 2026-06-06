/**
 * src/lib/fetchWithResilience.js
 * ─────────────────────────────────────────────────────────────────────────────
 * A production-grade fetch wrapper used across all AstroAid API calls.
 *
 * Features:
 *  ✓ AbortController-based timeout (default: 5000ms)
 *  ✓ Exponential back-off retry for HTTP 429, 500, 502, 503, 504
 *  ✓ Retry-After header respect (for 429 responses)
 *  ✓ Non-retriable fast-fail for 4xx errors (except 429)
 *  ✓ NetworkError wrapping for offline / connection refused scenarios
 */

export const DEFAULT_TIMEOUT_MS = 5000;
export const MAX_RETRIES = 3;

// HTTP status codes that are transient and worth retrying
const RETRIABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

/**
 * Pauses execution for `ms` milliseconds.
 * Uses setTimeout so jest.useFakeTimers() can control timing in tests.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculates the back-off delay for a given retry attempt.
 * Uses binary exponential back-off: base * 2^attempt (capped at 30s)
 *
 * @param {number} attempt       - Zero-indexed retry attempt number
 * @param {number} [baseMs=1000] - Base delay in milliseconds
 * @param {string|null} retryAfter - Value of the Retry-After header (seconds)
 * @returns {number} Delay in milliseconds
 */
function getBackOffDelay(attempt, baseMs = 1000, retryAfter = null) {
  if (retryAfter !== null) {
    const seconds = parseInt(retryAfter, 10);
    if (!Number.isNaN(seconds)) return seconds * 1000;
  }
  return Math.min(baseMs * Math.pow(2, attempt), 30_000);
}

/**
 * fetchWithResilience
 * ─────────────────────────────────────────────────────────────────────────────
 * @param {string} url                  - The URL to fetch
 * @param {object} [options={}]         - Configuration options
 * @param {number} [options.timeout]    - Request timeout in ms (default: 5000)
 * @param {number} [options.maxRetries] - Max retry attempts (default: 3)
 * @param {object} [options.fetchOptions] - Additional options passed to fetch()
 * @returns {Promise<any>}              - Parsed JSON response body
 * @throws {DOMException}              - AbortError on timeout
 * @throws {Error}                     - RateLimitError after exhausted retries
 * @throws {TypeError}                 - NetworkError on offline / DNS failure
 */
export async function fetchWithResilience(url, options = {}) {
  const {
    timeout = DEFAULT_TIMEOUT_MS,
    maxRetries = MAX_RETRIES,
    fetchOptions = {},
  } = options;

  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    // Create a fresh AbortController for each attempt
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // ── Success ────────────────────────────────────────────────────────────
      if (response.ok) {
        return await response.json();
      }

      // ── Non-retriable client errors ────────────────────────────────────────
      if (!RETRIABLE_STATUS_CODES.has(response.status)) {
        const body = await response.json().catch(() => ({}));
        const message = body?.error ?? body?.message ?? `HTTP ${response.status}`;
        throw new Error(
          `[${response.status}] ${response.statusText ?? "Error"}: ${message}`
        );
      }

      // ── Retriable error (429, 5xx) — back off and retry ───────────────────
      const retryAfter = response.headers?.get("Retry-After") ?? null;
      lastError = new Error(
        `[${response.status}] Rate limit or server error: Too Many Requests`
      );

      if (attempt < maxRetries) {
        const delay = getBackOffDelay(attempt, 1000, retryAfter);
        await sleep(delay);
      }
    } catch (err) {
      clearTimeout(timeoutId);

      // ── AbortError from our timeout ────────────────────────────────────────
      if (err.name === "AbortError") {
        throw err; // Don't retry on timeout — surface immediately
      }

      // ── NetworkError (offline, DNS fail, etc.) ─────────────────────────────
      if (err instanceof TypeError) {
        lastError = err;
        if (attempt < maxRetries) {
          const delay = getBackOffDelay(attempt);
          await sleep(delay);
          continue;
        }
        throw err;
      }

      // ── Non-retriable application errors — re-throw immediately ───────────
      throw err;
    }
  }

  // All retries exhausted
  throw lastError ?? new Error("fetchWithResilience: unknown error after retries");
}
