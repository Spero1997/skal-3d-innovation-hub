// Retry helper with exponential backoff for AI calls.
// Honours 429 and 5xx transient errors. Does NOT retry 4xx (validation) or 402 (payment).
export type RetryOptions = {
  retries?: number;
  baseMs?: number;
  maxMs?: number;
};

export async function withAiRetry<T>(
  fn: () => Promise<T>,
  opts: RetryOptions = {},
): Promise<T> {
  const retries = opts.retries ?? 3;
  const baseMs = opts.baseMs ?? 400;
  const maxMs = opts.maxMs ?? 4000;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (e: any) {
      lastErr = e;
      const msg = String(e?.message ?? e);
      const transient = /429|5\d{2}|ECONNRESET|ETIMEDOUT|fetch failed/i.test(msg);
      if (!transient || attempt === retries) throw e;
      const wait = Math.min(maxMs, baseMs * Math.pow(2, attempt))
        + Math.floor(Math.random() * 200);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

// Simple in-memory token bucket per user, persists across invocations within a warm worker.
const buckets = new Map<string, { tokens: number; updatedAt: number }>();
export function checkRateLimit(
  key: string,
  ratePerMinute = 20,
  burst = 30,
): { ok: true } | { ok: false; retryAfterMs: number } {
  const now = Date.now();
  const refillPerMs = ratePerMinute / 60000;
  const b = buckets.get(key) ?? { tokens: burst, updatedAt: now };
  const elapsed = now - b.updatedAt;
  b.tokens = Math.min(burst, b.tokens + elapsed * refillPerMs);
  b.updatedAt = now;
  if (b.tokens < 1) {
    const retryAfterMs = Math.ceil((1 - b.tokens) / refillPerMs);
    buckets.set(key, b);
    return { ok: false, retryAfterMs };
  }
  b.tokens -= 1;
  buckets.set(key, b);
  return { ok: true };
}