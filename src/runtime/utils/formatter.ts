export function trimTrailingSlash(path: string): string {
  return path.replace(/(?<!^)\/$/, '')
}
