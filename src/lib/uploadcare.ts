// lib/uploadcare.ts
import crypto from "crypto";

export function createSignedHeaders(
  verb: string,
  contentMd5: string,
  contentType: string,
  dateString: string,
  uri: string
): {
  Authorization: string;
  Date: string;
  Accept: string;
  "Content-Type": string;
  "Content-MD5": string;
} {
  if (
    !process.env.UPLOADCARE_SECRET_KEY ||
    !process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY
  ) {
    throw new Error(
      "UPLOADCARE_SECRET_KEY and NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY must be set"
    );
  }
  const secretKey = process.env.UPLOADCARE_SECRET_KEY;
  const publicKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;

  // Prepare the string to sign
  const signString = [verb, contentMd5, contentType, dateString, uri].join(
    "\n"
  );

  // Create HMAC SHA1 signature
  const signature = crypto
    .createHmac("sha1", secretKey)
    .update(signString)
    .digest("hex");

  return {
    Authorization: `Uploadcare ${publicKey}:${signature}`,
    Date: dateString,
    Accept: "application/vnd.uploadcare-v0.7+json",
    "Content-Type": contentType,
    "Content-MD5": contentMd5,
  };
}

/**
 * Helper to get MD5 of a (possibly empty) string.
 * For an empty string, this returns the well-known MD5: d41d8cd98f00b204e9800998ecf8427e
 */
export function md5hash(data: string) {
  return crypto.createHash("md5").update(data).digest("hex");
}
