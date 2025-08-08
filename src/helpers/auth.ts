import Log from '../config/logging.ts'
import { getValueFromSessionStorageByKey, isValuePresentInSessionStorage } from './sessionStorage.ts'

const AUTH_TOKEN_KEY: string = 'auth_token'
const NAME: string = 'i18next'

const localLog: Log = Log.getInstance()

export interface IToken {
  access_token: string
}

export async function getToken(): Promise<string | undefined> {
  const token: string | undefined = getTokenFromSessionStorage()

  if (token) {
    return token
  }

  localLog.debug(NAME, 'Getting token from the Backend Api')
  const response: Response = await fetch('/api/auth', { method: 'POST' })

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
  localLog.error(NAME, errorMessage)
  return undefined
}
