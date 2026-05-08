import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useSanctumUser } from '~/src/runtime/composables/useSanctumUser'

const {
  useStateMock,
  useSanctumConfigMock,
} = vi.hoisted(() => {
  return {
    useStateMock: vi.fn(() => ({ value: null as object | null })),
    useSanctumConfigMock: vi.fn(() => ({ userStateKey: 'test' })),
  }
})

mockNuxtImport('useState', () => useStateMock)

vi.mock(
  '~/src/runtime/composables/useSanctumConfig',
  () => ({ useSanctumConfig: useSanctumConfigMock }),
)

interface UserModel {
  id: number
  email: string
}

describe('useSanctumUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when user is not set', () => {
    useStateMock.mockReturnValue({ value: null })

    const result = useSanctumUser()

    expect(result.value).toBeNull()
  })

  it('returns identity when user is set', () => {
    useStateMock.mockReturnValue({ value: { id: 1, email: 'john@doe.com' } })

    const result = useSanctumUser()

    expect(result.value).toStrictEqual({ id: 1, email: 'john@doe.com' })
  })

  it('returns typed identity when user is set', () => {
    useStateMock.mockReturnValue({ value: { id: 1, email: 'john@doe.com' } })

    const result = useSanctumUser<UserModel>()
    const typedResult = result.value satisfies UserModel | null

    expect(typedResult?.email).toBe('john@doe.com')
  })

  it('calls useSanctumConfig to get options', () => {
    const customKey = 'custom-user-state'

    useStateMock.mockReturnValue({ value: null })
    useSanctumConfigMock.mockReturnValue({ userStateKey: customKey })

    useSanctumUser()

    expect(useSanctumConfigMock).toHaveBeenCalled()
    expect(useStateMock).toHaveBeenCalledWith(customKey, expect.any(Function))
  })
})
