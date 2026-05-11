import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useLazySanctumFetch } from '~/src/runtime/composables/useLazySanctumFetch'
import { ofetch } from 'ofetch'

const
  ENDPOINT = 'http://use-sanctum-fetch.dev',
  RESPONSE = { message: 'ok' },
  fetchInstance = ofetch.create({}),
  fetchSpy = vi.fn(fetchInstance)

const {
  useSanctumClientMock,
} = vi.hoisted(() => ({
  useSanctumClientMock: vi.fn(() => fetchSpy),
}))

vi.mock(
  '~/src/runtime/composables/useSanctumClient',
  () => ({ useSanctumClient: useSanctumClientMock }),
)

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

    expect(useSanctumClientMock).toHaveBeenCalled()
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

    expect(useSanctumClientMock).toHaveBeenCalled()
    expect(data.value).toStrictEqual(RESPONSE)
  })
})
