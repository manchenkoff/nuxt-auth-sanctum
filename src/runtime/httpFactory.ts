import { $Fetch, FetchOptions } from 'ofetch';
import { appendHeader } from 'h3';
import {
  useCookie,
  useRequestEvent,
  useRequestHeaders,
  useRuntimeConfig,
  navigateTo,
  useNuxtApp,
} from '#app';
import { SanctumModuleOptions } from '../types';
import { useSanctumUser } from './composables/useSanctumUser';
import { useRequestURL } from 'nuxt/app';

export const SECURE_METHODS = new Set(['post', 'delete', 'put', 'patch']);

export function createHttpClient(): $Fetch {
  const options = useRuntimeConfig().public.sanctum as SanctumModuleOptions;
  const event = useRequestEvent();
  const user = useSanctumUser();
  const nuxtApp = useNuxtApp();

  /**
   * Request a new CSRF cookie from the API and pass it to the headers collection
   * @param headers Headers collection to extend
   * @returns {HeadersInit}
   */
  async function buildClientHeaders(
    headers: HeadersInit | undefined,
  ): Promise<HeadersInit> {
    await $fetch(options.endpoints.csrf, {
      baseURL: options.baseUrl,
      credentials: 'include',
    });

    const csrfToken = useCookie(options.csrf.cookie).value;

    return {
      ...headers,
      ...(csrfToken && { [options.csrf.header]: csrfToken }),
    };
  }

  /**
   * Pass all cookies, headers and referrer from the client to the API
   * @param headers Headers collection to extend
   * @returns { HeadersInit }
   */
  function buildServerHeaders(headers: HeadersInit | undefined): HeadersInit {
    const csrfToken = useCookie(options.csrf.cookie).value;
    const clientCookies = useRequestHeaders(['cookie']);
    const origin = options.origin ?? useRequestURL().origin;

    return {
      ...headers,
      // use the origin from the request headers if not set
      Referer: origin,
      ...(clientCookies.cookie && clientCookies),
      ...(csrfToken && { [options.csrf.header]: csrfToken }),
    };
  }

  const httpOptions: FetchOptions = {
    baseURL: options.baseUrl,
    credentials: 'include',
    redirect: 'manual',
    retry: options.client.retry,

    async onRequest({ options }): Promise<void> {
      const method = options.method?.toLowerCase() ?? 'get';

      options.headers = {
        Accept: 'application/json',
        ...options.headers,
      };

      // https://laravel.com/docs/10.x/routing#form-method-spoofing
      if (options.body instanceof FormData && method === 'put') {
        options.method = 'POST';
        options.body.append('_method', 'PUT');
      }

      if (process.server) {
        options.headers = buildServerHeaders(options.headers);
      }

      if (process.client) {
        if (!SECURE_METHODS.has(method)) {
          return;
        }

        options.headers = await buildClientHeaders(options.headers);
      }
    },

    async onResponse({ response }): Promise<void> {
      // pass all cookies from the API to the client on SSR response
      if (process.server) {
        const serverCookieName = 'set-cookie';
        const cookie = response.headers.get(serverCookieName);

        if (cookie === null) {
          return;
        }

        appendHeader(event, serverCookieName, cookie);
      }

      // follow redirects on client
      if (response.redirected) {
        await nuxtApp.runWithContext(() => navigateTo(response.url));
      }
    },

    async onResponseError({ request, response }): Promise<void> {
      if (response.status === 401) {
        // do not redirect when requesting the user endpoint
        // this prevents an infinite loop (ERR_TOO_MANY_REDIRECTS)
        if (request.toString().endsWith(options.endpoints.user)) {
          return;
        }

        user.value = null;

        if (options.redirect.onLogout) {
          await nuxtApp.runWithContext(() =>
            navigateTo(options.redirect.onLogout as string),
          );
        }
      }
    },
  };

  return $fetch.create(httpOptions) as $Fetch;
}
