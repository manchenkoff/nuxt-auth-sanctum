declare module 'nitropack/types' {
  interface NitroRuntimeHooks {
    /**
     * Triggers on every proxy client request.
     */
    'sanctum:proxy:request': (ctx: FetchContext, logger: ConsolaInstance) => void
  }
}
