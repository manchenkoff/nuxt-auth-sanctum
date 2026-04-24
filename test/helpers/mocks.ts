import type { NuxtApp } from '#app'
import type { ConsolaInstance } from 'consola'
import { vi } from 'vitest'

export function createMock<T>(mock: object = {}): T {
  return mock as T
}

export function createAppMock(mock: object = {}): NuxtApp {
  const resolved = {
    callHook: vi.fn(),
    runWithContext: vi.fn().mockImplementation((fn: () => void) => { fn() }),
    ...mock,
  }

  return createMock<NuxtApp>(resolved)
}

export function createLoggerMock(mock: object = {}): ConsolaInstance {
  const resolved = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    trace: vi.fn(),
    ...mock,
  }

  return createMock<ConsolaInstance>(resolved)
}
