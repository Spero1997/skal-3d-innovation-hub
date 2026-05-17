import { assertEquals, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { withAiRetry, checkRateLimit } from "./ai-retry.ts";

Deno.test("withAiRetry retries on 429 then succeeds", async () => {
  let n = 0;
  const result = await withAiRetry(async () => {
    n++;
    if (n < 3) throw new Error("HTTP 429 Too Many Requests");
    return "ok";
  }, { retries: 3, baseMs: 1, maxMs: 5 });
  assertEquals(result, "ok");
  assertEquals(n, 3);
});

Deno.test("withAiRetry does NOT retry on 400", async () => {
  let n = 0;
  await assertRejects(async () => {
    await withAiRetry(async () => {
      n++;
      throw new Error("HTTP 400 Bad Request");
    }, { retries: 3, baseMs: 1 });
  });
  assertEquals(n, 1);
});

Deno.test("checkRateLimit blocks after burst", () => {
  const key = `test:${Math.random()}`;
  for (let i = 0; i < 5; i++) {
    const r = checkRateLimit(key, 1, 5);
    assertEquals(r.ok, true);
  }
  const blocked = checkRateLimit(key, 1, 5);
  assertEquals(blocked.ok, false);
});