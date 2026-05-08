import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSanctumFetch } from '~/src/runtime/composables/useSanctumFetch'
import type { SanctumFetch } from '~/src/runtime/types/fetch'
import { computed, ref } from 'vue'

import * as client from '~/src/runtime/composables/useSanctumClient'
import * as app from '#app'

const
  ENDPOINT = 'http://use-sanctum-fetch.dev',
  RESPONSE = { message: 'ok' },
  clientSpy = vi.spyOn(client, 'useSanctumClient'),
  useFetchSpy = vi.spyOn(app, 'useFetch')

describe('useSanctumFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns response using useFetch', async () => {
    registerEndpoint(ENDPOINT, {
      method: 'GET',
      handler: () => RESPONSE,
    })

    const { data } = await useSanctumFetch(ENDPOINT)

    expect(clientSpy).toHaveBeenCalled()
    expect(useFetchSpy).toHaveBeenCalled()
    expect(data.value).toStrictEqual(RESPONSE)
  })

  it('passes options down to useFetch', async () => {
    registerEndpoint(ENDPOINT, {
      method: 'POST',
      handler: () => RESPONSE,
    })

    const { data } = await useSanctumFetch(
      ENDPOINT,
      { method: 'POST' },
    )

    expect(clientSpy).toHaveBeenCalled()
    expect(useFetchSpy).toHaveBeenCalled()
    expect(data.value).toStrictEqual(RESPONSE)
  })

  it('resolves request key if not provided [raw]', async () => {
    registerEndpoint(ENDPOINT, {
      method: 'GET',
      handler: () => RESPONSE,
    })

    const { data } = await useSanctumFetch(ENDPOINT)

    expect(clientSpy).toHaveBeenCalled()
    expect(useFetchSpy).toHaveBeenCalledWith(
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
    const { data } = await useSanctumFetch(urlRef)

    expect(clientSpy).toHaveBeenCalled()
    expect(useFetchSpy).toHaveBeenCalledWith(
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
    const { data } = await useSanctumFetch(urlComputed)

    expect(clientSpy).toHaveBeenCalled()
    expect(useFetchSpy).toHaveBeenCalledWith(
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

    const { data } = await useSanctumFetch(ENDPOINT, { key: 'request-key' })

    expect(clientSpy).toHaveBeenCalled()
    expect(useFetchSpy).toHaveBeenCalledWith(
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

    await useSanctumFetch(ENDPOINT, { key: 'request-key' })

    expect(clientSpy).toHaveBeenCalled()
    expect(useFetchSpy).toHaveBeenCalledWith(
      ENDPOINT,
      {
        key: 'request-key',
        $fetch: null,
      },
      expect.any(String),
    )
  })
})
