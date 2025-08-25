import { Logger, logs, SeverityNumber } from '@opentelemetry/api-logs'
import { GlobalConfig } from './config.ts'
import prefix from 'loglevel-plugin-prefix'
import log from 'loglevel'
import { getValueFromSessionStorageByKey, isValuePresentInSessionStorage } from '../helpers/sessionStorage.ts'

const KEY: string = 'SESSION_ID'

function getSessionId(): string {
  if (isValuePresentInSessionStorage(KEY)) {
    return getValueFromSessionStorageByKey(KEY)
  }

  const sessionId: string = crypto.randomUUID()
  sessionStorage.setItem(KEY, sessionId)

  return sessionId
}

export default class Log {
  private static instance: Log

  private constructor() {
    prefix.reg(log)

    prefix.apply(log, {
      format(level: string, name: string | undefined): string {
        return `${level.toUpperCase()} [${name}] [${getSessionId()}] -`
      },
    })

    log.setLevel('debug')
  }

  static getInstance(): Log {
    if (!Log.instance) {
      Log.instance = new Log()
    }

    return Log.instance
  }

  debug(name: string, message: string): void {
    if (!GlobalConfig.otel.debugInConsole) {
      this.emit(name, SeverityNumber.DEBUG, 'debug', message)
    }

    log.getLogger(name).debug(message)
  }

  info(name: string, message: string): void {
    if (!GlobalConfig.otel.debugInConsole) {
      this.emit(name, SeverityNumber.INFO, 'info', message)
    }

    log.getLogger(name).info(message)
  }

  error(name: string, message: string): void {
    if (!GlobalConfig.otel.debugInConsole) {
      this.emit(name, SeverityNumber.ERROR, 'error', message)
    }

    log.getLogger(name).error(message)
  }

  private emit(name: string, severityNumber: SeverityNumber, severityText: string, message: string): void {
    this.getLogger(name).emit({
      severityNumber: severityNumber,
      severityText: severityText,
      body: `[${name}] [${getSessionId()}] - ${message}`,
      attributes: { session_id: getSessionId() },
    })
  }

  private getLogger(name: string): Logger {
    return logs.getLogger(name, GlobalConfig.otel.attrs.serviceVersion, { includeTraceContext: true })
  }
}
