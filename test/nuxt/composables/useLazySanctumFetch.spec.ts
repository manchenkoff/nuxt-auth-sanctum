import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useLazySanctumFetch } from '~/src/runtime/composables/useLazySanctumFetch'
import type { SanctumFetch } from '~/src/runtime/types/fetch'
import { computed, ref } from 'vue'

import * as client from '~/src/runtime/composables/useSanctumClient'
import * as app from '#app'

const
  ENDPOINT = 'http://use-sanctum-fetch.dev',
  RESPONSE = { message: 'ok' },
  clientSpy = vi.spyOn(client, 'useSanctumClient'),
  useLazyFetchSpy = vi.spyOn(app, 'useLazyFetch')

describe('useLazySanctumFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns response using useLazyFetch', async () => {
    registerEndpoint(ENDPOINT, {
      method: 'GET',
      handler: () => RESPONSE,
    })

    const { data } = await useLazySanctumFetch(ENDPOINT)

    expect(clientSpy).toHaveBeenCalled()
    expect(useLazyFetchSpy).toHaveBeenCalled()
    expect(data.value).toStrictEqual(RESPONSE)
  })

  it('passes options down to useLazyFetch', async () => {
    registerEndpoint(ENDPOINT, {
      method: 'POST',
      handler: () => RESPONSE,
    })

    const { data } = await useLazySanctumFetch(
      ENDPOINT,
      { method: 'POST' },
    )

    expect(clientSpy).toHaveBeenCalled()
    expect(useLazyFetchSpy).toHaveBeenCalled()
    expect(data.value).toStrictEqual(RESPONSE)
  })

  it('resolves request key if not provided [raw]', async () => {
    registerEndpoint(ENDPOINT, {
      method: 'GET',
      handler: () => RESPONSE,
    })

    const { data } = await useLazySanctumFetch(ENDPOINT)

    expect(clientSpy).toHaveBeenCalled()
    expect(useLazyFetchSpy).toHaveBeenCalledWith(
      ENDPOINT,
      {
        key: JSON.stringify([ENDPOINT, null]),
        $fetch: undefined,
      },
      expect.any(String),
    )
    expect(data.value).toStrictEqual(RESPONSE)
  })

  it('resolves request key if not provided [refs]', async () => {
    registerEndpoint(ENDPOINT, {
      method: 'GET',
      handler: () => RESPONSE,
    })

    const urlRef = ref(ENDPOINT)
    const { data } = await useLazySanctumFetch(urlRef)

    expect(clientSpy).toHaveBeenCalled()
    expect(useLazyFetchSpy).toHaveBeenCalledWith(
      urlRef,
      {
        key: JSON.stringify([ENDPOINT, null]),
        $fetch: undefined,
      },
      expect.any(String),
    )
    expect(data.value).toStrictEqual(RESPONSE)
  })

  it('resolves request key if not provided [getter]', async () => {
    registerEndpoint(ENDPOINT, {
      method: 'GET',
      handler: () => RESPONSE,
    })

    const urlComputed = computed(() => ENDPOINT)
    const { data } = await useLazySanctumFetch(urlComputed)

    expect(clientSpy).toHaveBeenCalled()
    expect(useLazyFetchSpy).toHaveBeenCalledWith(
      urlComputed,
      {
        key: JSON.stringify([ENDPOINT, null]),
        $fetch: undefined,
      },
      expect.any(String),
    )
    expect(data.value).toStrictEqual(RESPONSE)
  })

  it('passes request key if provided', async () => {
    registerEndpoint(ENDPOINT, {
      method: 'GET',
      handler: () => RESPONSE,
    })

    const { data } = await useLazySanctumFetch(ENDPOINT, { key: 'request-key' })

    expect(clientSpy).toHaveBeenCalled()
    expect(useLazyFetchSpy).toHaveBeenCalledWith(
      ENDPOINT,
      {
        key: 'request-key',
        $fetch: undefined,
      },
      expect.any(String),
    )
    expect(data.value).toStrictEqual(RESPONSE)
  })

  it('uses sanctumClient as $fetch', async () => {
    clientSpy.mockReturnValue(null as unknown as SanctumFetch)

    await useLazySanctumFetch(ENDPOINT, { key: 'request-key' })

    expect(clientSpy).toHaveBeenCalled()
    expect(useLazyFetchSpy).toHaveBeenCalledWith(
      ENDPOINT,
      {
        key: 'request-key',
        $fetch: null,
      },
      expect.any(String),
    )
  })
})
