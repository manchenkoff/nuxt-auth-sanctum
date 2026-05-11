import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { ofetch } from 'ofetch'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSanctumFetch } from '~/src/runtime/composables/useSanctumFetch'

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

    expect(useSanctumClientMock).toHaveBeenCalled()
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

    expect(useSanctumClientMock).toHaveBeenCalled()
    expect(data.value).toStrictEqual(RESPONSE)
  })
})
