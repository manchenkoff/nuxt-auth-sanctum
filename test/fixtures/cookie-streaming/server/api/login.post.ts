import type { EventHandlerRequest, H3Event } from 'h3'
import { useCsrfValidation } from '../utils/useCsrfValidation'
import { useCsrfCookie } from '../utils/useCsrfCookie'
import { useSessionCookie } from '../utils/useSessionCookie'
import { USER_EMAIL } from '../constants'

interface LoginRequest {
  email: string
  password: string
}

interface LoginRequestValidation {
  isValid: boolean
  result?: ValidationResult
}

interface ValidationResult {
  message: string
  errors: Record<string, string[]>
}

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  useCsrfValidation(event)

  const body = await readBody<LoginRequest>(event)
  const { isValid, result } = validateRequest(body)

  if (isValid == false) {
    setResponseStatus(event, 422)
    return result
  }

  useCsrfCookie(event)
  useSessionCookie(event)

  setResponseStatus(event, 204)

  return null
})

function validateRequest(body: LoginRequest): LoginRequestValidation {
  const isValid = body.email == USER_EMAIL && body.password == 'password'

  if (isValid) {
    return {
      isValid: true,
      result: undefined,
    }
  }

  return {
    isValid: false,
    result: {
      message: 'Wrong user credentials',
      errors: {
        email: ['Wrong user credentials'],
      },
    },
  }
}
