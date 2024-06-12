/**
 * Page meta information to be used by the global middleware.
 */
export interface SanctumGlobalMiddlewarePageMeta {
    /**
     * Determines whether the page should be excluded from middleware checks.
     */
    excluded?: boolean;
    /**
     * Determines whether the page should be accessible only by unauthenticated users.
     */
    guestOnly?: boolean;
}
