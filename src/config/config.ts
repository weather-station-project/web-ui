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

interface IOtelConfig {
  rootUrl: string
  debugInConsole: boolean
  attrs: {
    serviceName: string
    serviceVersion: string
    deploymentEnvironment: string
  }
}

export class Config {
  backend: IBackendConfig
  socketEvents: ISocketEvents
  times: ITimesConfig
  otel: IOtelConfig

  constructor() {
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

    this.otel = {
      rootUrl: this.getValue('OTEL_FAKE_ENDPOINT') || 'http://localhost:5173/otel', // This endpoint is not present, the call is redirected in vite.config.ts or nginx
      debugInConsole: this.isKeyPresent('OTEL_DEBUG_IN_CONSOLE') ? this.getValueAsBoolean('OTEL_DEBUG_IN_CONSOLE') : true,
      attrs: {
        serviceName: 'wsp-web-ui',
        serviceVersion: this.getValue('OTEL_SERVICE_VERSION') || '0.0.1',
        deploymentEnvironment: this.getValue('OTEL_DEPLOYMENT_ENVIRONMENT') || 'localhost',
      },
    }
  }

  isKeyPresent(key: string): boolean {
    return sessionStorage && sessionStorage.getItem(key) !== null
  }

  getValue(key: string): string | null {
    return this.isKeyPresent(key) ? (sessionStorage.getItem(key)?.trim() as string) : null
  }

  getValueAsBoolean(key: string): boolean {
    const value: string | null = this.getValue(key)
    return value !== null ? value.toLowerCase() === 'true' : false
  }
}

const globalConfigInstance: Config = new Config()
export { globalConfigInstance as GlobalConfig }
