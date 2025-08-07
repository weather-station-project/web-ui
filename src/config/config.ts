import log from 'loglevel'

interface ILoggingConfig {
  level: log.LogLevelDesc
}

interface IBackendConfig {
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

interface IOtlpConfig {
  rootUrl: string
  debugInConsole: boolean
  attrs: {
    serviceName: string
    serviceVersion: string
    deploymentEnvironment: string
  }
}

export class Config {
  logging: ILoggingConfig
  backend: IBackendConfig
  socketEvents: ISocketEvents
  times: ITimesConfig
  otlp: IOtlpConfig

  constructor() {
    this.logging = {
      level: 'debug' as unknown as log.LogLevelDesc,
    }

    this.backend = {
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

    this.otlp = {
      rootUrl: 'http://localhost:5173/otel', // This endpoint is not present, the call is redirected in the vite.config.ts
      debugInConsole: this.getValueAsBoolean('OTEL_DEBUG_IN_CONSOLE') || true,
      attrs: {
        serviceName: 'wsp-web-ui',
        serviceVersion: this.getValue('OTEL_SERVICE_VERSION') || '0.0.1',
        deploymentEnvironment: this.getValue('OTEL_DEPLOYMENT_ENVIRONMENT') || 'localhost',
      },
    }
  }

  getValue(key: string): string | null {
    return sessionStorage && sessionStorage.getItem(key) !== null ? (sessionStorage.getItem(key)?.trim() as string) : null
  }

  getValueAsBoolean(key: string): boolean {
    const value: string | null = this.getValue(key)
    return value !== null ? value.toLowerCase() === 'true' : false
  }
}

const globalConfigInstance: Config = new Config()
export { globalConfigInstance as GlobalConfig }
