/**
 * Removes the trailing slash from a path if it exists.
 * @param path The URL path.
 */
export function trimTrailingSlash(path: string): string {
  if (path.length > 1 && path.slice(-1) === '/') {
    return path.slice(0, -1)
  }
  return path
}
