import { Logger } from 'loglevel'
import log from '../config/logging.ts'
import { getValueFromSessionStorageByKey, isValuePresentInSessionStorage } from './sessionStorage.helper.ts'

const AUTH_TOKEN_KEY: string = 'auth_token'
const localLog: Logger = log.getLogger('auth helper')

export interface IToken {
  access_token: string
}

export interface IAuthFields {
  login: string
  password: string
}

export async function getTokenByUserPassword(apiUrl: string, authFields: IAuthFields): Promise<string | undefined> {
  const token: string | undefined = getTokenFromSessionStorage()

  if (token) {
    return token
  }

  localLog.debug('Getting token from the Backend Api')
  const response: Response = await fetch(`${apiUrl}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      login: authFields.login,
      password: authFields.password,
    }),
  })

  return await getTokenFromResponse(response)
}

export function resetToken(): void {
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
}

function getTokenFromSessionStorage(): string | undefined {
  if (isValuePresentInSessionStorage(AUTH_TOKEN_KEY)) {
    return getValueFromSessionStorageByKey(AUTH_TOKEN_KEY)
  }

  return undefined
}

async function getTokenFromResponse(response: Response): Promise<string | undefined> {
  if (response.ok) {
    const data: IToken = (await response.json()) as IToken
    sessionStorage.setItem(AUTH_TOKEN_KEY, data.access_token)

    return data.access_token
  }

  const errorMessage: string = `Error getting auth token: ${response.statusText} (${response.status})`
  localLog.error(errorMessage)
  return undefined
}
