/**
 * Determines the credentials mode for the fetch request.
 */
export function determineCredentialsMode() {
  // Fix for Cloudflare workers - https://github.com/cloudflare/workers-sdk/issues/2514
  const isCredentialsSupported = 'credentials' in Request.prototype

  if (!isCredentialsSupported) {
    return undefined
  }

  return 'include'
}
