export function getBaseUrl(req) {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/+$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  const proto = (req?.headers?.["x-forwarded-proto"] || "http").toString();
  const host =
    (req?.headers?.["x-forwarded-host"] ||
      req?.headers?.host ||
      "localhost:3000").toString();
  return `${proto}://${host}`;
}