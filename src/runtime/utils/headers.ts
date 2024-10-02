export function appendRequestHeaders(headers: Headers, append: Record<string, string>): Headers {
  for (const [key, value] of Object.entries(append)) {
    headers.set(key, value)
  }

  return headers
}
