import log from 'loglevel'
import { getValueFromSessionStorageByKey, isValuePresentInSessionStorage } from '../helpers/sessionStorage.ts'

interface ILoggingConfig {
  level: log.LogLevelDesc
}

interface IBackendConfig {
  backendUrl: string
  socketUrl: string
  login: string
  password: string
  maxAttempts: number
  delayInMilliseconds: number
}

interface ISocketEvents {
  airMeasurement: string
  groundTemperature: string
  windMeasurement: string
  rainfall: string
  exception: string
}

interface ITimesConfig {
  toastDurationInMilliseconds: number
}

export class Config {
  logging: ILoggingConfig
  backend: IBackendConfig
  socketEvents: ISocketEvents
  times: ITimesConfig

  constructor() {
    this.logging = {
      level: (isValuePresentInSessionStorage('LOG_LEVEL') ? getValueFromSessionStorageByKey('LOG_LEVEL') : 'debug') as unknown as log.LogLevelDesc,
    }

    this.backend = {
      socketUrl: isValuePresentInSessionStorage('SOCKET_URL') ? getValueFromSessionStorageByKey('SOCKET_URL') : 'http://localhost:8081',
      backendUrl: isValuePresentInSessionStorage('BACKEND_URL') ? getValueFromSessionStorageByKey('BACKEND_URL') : 'http://localhost:8080',
      login: isValuePresentInSessionStorage('LOGIN') ? getValueFromSessionStorageByKey('LOGIN') : 'dashboard',
      password: isValuePresentInSessionStorage('PASSWORD') ? getValueFromSessionStorageByKey('PASSWORD') : '123456',
      maxAttempts: 20,
      delayInMilliseconds: 1000,
    }

    this.socketEvents = {
      exception: 'exception',
      airMeasurement: 'emitAirMeasurement',
      groundTemperature: 'emitGroundTemperature',
      windMeasurement: 'emitWindMeasurement',
      rainfall: 'emitRainfall',
    }

    this.times = {
      toastDurationInMilliseconds: 3000,
    }
  }
}

const globalConfigInstance: Config = new Config()
export { globalConfigInstance as GlobalConfig }
