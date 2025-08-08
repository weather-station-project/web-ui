import { Logger, logs, SeverityNumber } from '@opentelemetry/api-logs'
import { GlobalConfig } from './config.ts'
import prefix from 'loglevel-plugin-prefix'
import log from 'loglevel'

export default class Log {
  private static instance: Log

  private constructor() {
    prefix.reg(log)
    prefix.apply(log, {
      format(level: string, name: string | undefined): string {
        return `${level.toUpperCase()} [${name}] -`
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
    this.getLogger(name).emit({
      severityNumber: SeverityNumber.DEBUG,
      severityText: 'DEBUG',
      body: message,
    })

    log.getLogger(name).debug(message)
  }

  info(name: string, message: string): void {
    this.getLogger(name).emit({
      severityNumber: SeverityNumber.INFO,
      severityText: 'INFO',
      body: message,
    })

    log.getLogger(name).info(message)
  }

  error(name: string, message: string): void {
    this.getLogger(name).emit({
      severityNumber: SeverityNumber.ERROR,
      severityText: 'ERROR',
      body: message,
    })

    log.getLogger(name).error(message)
  }

  private getLogger(name: string): Logger {
    return logs.getLogger(name, GlobalConfig.otlp.attrs.serviceVersion, { includeTraceContext: true })
  }
}
