import log from 'loglevel'

interface LoggingConfig {
    level: log.LogLevelDesc
}

export class Config {
    logging: LoggingConfig

    constructor() {
        this.logging = {
            level: (this.isValuePresent('LOG_LEVEL') ? this.getValue('LOG_LEVEL') : 'debug') as unknown as log.LogLevelDesc,
        };
    }

    private isValuePresent(key: string): boolean {
        return sessionStorage && sessionStorage.getItem(key) !== null && sessionStorage.getItem(key)?.trim() !== ''
    }

    private getValue(key: string): string {
        return sessionStorage.getItem(key) ? (sessionStorage.getItem(key)?.trim() as string) : ''
    }

    /*private getValueAsNumber(key: string): number {
        return Number(this.getValue(key))
    }

    private getValueAsBoolean(key: string): boolean {
        return this.getValue(key).toLowerCase() === 'true'
    }*/
}

const globalConfigInstance: Config = new Config()
export { globalConfigInstance as GlobalConfig }