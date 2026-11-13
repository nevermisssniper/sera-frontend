import { createHmac, timingSafeEqual } from "crypto";

// Sign the exact UTF-8 body; timestamp bounds replay and job IDs bind updates.
export function verifyGenerationSignature(body: string, timestamp: string | null, signature: string | null): boolean {
  const secret = process.env.GENERATION_CALLBACK_SECRET;
  if (!secret || !timestamp || !/^\d+$/.test(timestamp) || !signature || !/^[a-f0-9]{64}$/.test(signature)) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest();
  return timingSafeEqual(expected, Buffer.from(signature, "hex"));
}
