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
      rootUrl: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318',
      debugInConsole: process.env.OTEL_DEBUG_IN_CONSOLE === 'true',
      attrs: {
        serviceName: 'wsp-web-ui',
        serviceVersion: process.env.OTEL_SERVICE_VERSION || '0.0.1',
        deploymentEnvironment: process.env.OTEL_DEPLOYMENT_ENVIRONMENT || 'localhost',
      },
    }
  }
}

const globalConfigInstance: Config = new Config()
export { globalConfigInstance as GlobalConfig }
