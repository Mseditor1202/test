export function getBaseUrl(req) {
  if (req) {
    const proto = (req.headers["x-forwarded-proto"] || "http").toString().split(",")[0];
    const host = (req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000").toString();
    return `${proto}://${host}`.replace(/\/+$/, "");
  }

  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/+$/, "");
  return "http://localhost:3000";
  }