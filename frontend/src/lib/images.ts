export function getProductImageUrl(path?: string | null): string {
  if (!path) {
    return "";
  }

  // Image path (URL)
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Relative path (/media)
  const apiBase = (
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
  ).replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${apiBase}${normalizedPath}`;
}
