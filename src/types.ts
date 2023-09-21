export interface SanctumEndpoints {
    csrf: string;
    login: string;
    logout: string;
    user: string;
}

export interface CsrfOptions {
    cookie: string;
    header: string;
}

export interface ClientOptions {
    retry: number | false;
}

export interface RedirectOptions {
    keepRequestedRoute: boolean;
    onLogin: string | false;
    onLogout: string | false;
    onAuthOnly: string | false;
    onGuestOnly: string | false;
}

export interface SanctumOptions {
    baseUrl: string;
    origin: string;
    userStateKey: string;
    endpoints: SanctumEndpoints;
    csrf: CsrfOptions;
    client: ClientOptions;
    redirect: RedirectOptions;
}
