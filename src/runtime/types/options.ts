/**
 * Definition of Laravel Sanctum endpoints to be used by the client.
 */
export interface SanctumEndpoints {
    /**
     * The endpoint to request a new CSRF token.
     * @default '/sanctum/csrf-cookie'
     */
    csrf: string;
    /**
     * The endpoint to send user credentials to authenticate.
     * @default '/login'
     */
    login: string;
    /**
     * The endpoint to destroy current user session.
     * @default '/logout'
     */
    logout: string;
    /**
     * The endpoint to fetch current user data.
     * @default '/api/user'
     */
    user: string;
}

/**
 * CSRF token specific options.
 */
export interface CsrfOptions {
    /**
     * Name of the CSRF cookie to extract from server response.
     * @default 'XSRF-TOKEN'
     */
    cookie: string;
    /**
     * Name of the CSRF header to pass from client to server.
     * @default 'X-XSRF-TOKEN'
     */
    header: string;
}

/**
 * OFetch client specific options.
 */
export interface ClientOptions {
    /**
     * The number of times to retry a request when it fails.
     * @default false
     */
    retry: number | false;
}

/**
 * Behavior of the plugin redirects when user is authenticated or not.
 */
export interface RedirectOptions {
    /**
     * Determines whether to keep the requested route when redirecting after login.
     * @default false
     */
    keepRequestedRoute: boolean;
    /**
     * Route to redirect to when user is authenticated.
     * If set to false, do nothing.
     * @default '/'
     */
    onLogin: string | false;
    /**
     * Route to redirect to when user is not authenticated.
     * If set to false, do nothing.
     * @default '/'
     */
    onLogout: string | false;
    /**
     * Route to redirect to when user has to be authenticated.
     * If set to false, the plugin will throw an 403 error.
     * @default '/login'
     */
    onAuthOnly: string | false;
    /**
     * Route to redirect to when user has to be a guest.
     * If set to false, the plugin will throw an 403 error.
     * @default '/'
     */
    onGuestOnly: string | false;
}

/**
 * Configuration of the global application-wide middleware.
 */
export interface GlobalMiddlewareOptions {
    /**
     * Determines whether the global middleware is enabled.
     * @default false
     */
    enabled: boolean;
    /**
     * Determines whether to allow 404 pages without authentication.
     * @default true
     */
    allow404WithoutAuth: boolean;
}

/**
 * Options to be passed to the plugin.
 */
export interface SanctumModuleOptions {
    /**
     * The base URL of the Laravel API.
     */
    baseUrl: string;
    /**
     * The mode to use for authentication.
     */
    mode: 'cookie' | 'token';
    /**
     * The URL of the current application to use in Referrer header. (Optional)
     */
    origin?: string;
    /**
     * The key to use to store the user identity in the `useState` variable.
     * @default 'sanctum.user.identity'
     */
    userStateKey: string;
    /**
     * Determine whether to redirect when the user is authenticated when on login attempt.
     * @default false
     */
    redirectIfAuthenticated: boolean;
    /**
     * Determine whether to redirect when the user got unauthenticated on any API request.
     * @default false
     */
    redirectIfUnauthenticated: boolean;
    /**
     * Laravel Sanctum endpoints to be used by the client.
     */
    endpoints: SanctumEndpoints;
    /**
     * CSRF token specific options.
     */
    csrf: CsrfOptions;
    /**
     * OFetch client specific options.
     */
    client: ClientOptions;
    /**
     * Behavior of the plugin redirects when user is authenticated or not.
     */
    redirect: RedirectOptions;
    /**
     * Behavior of the global middleware.
     */
    globalMiddleware: GlobalMiddlewareOptions;
    /**
     * The log level to use for the logger.
     *
     * 0: Fatal and Error
     * 1: Warnings
     * 2: Normal logs
     * 3: Informational logs
     * 4: Debug logs
     * 5: Trace logs
     *
     * More details at https://github.com/unjs/consola?tab=readme-ov-file#log-level
     * @default 3
     */
    logLevel: number;
}
