import log from 'loglevel'
import prefix from 'loglevel-plugin-prefix'
import { GlobalConfig } from './config'

prefix.reg(log)
prefix.apply(log, {
  format(level, name) {
    return `${level.toUpperCase()} [${name}] -`
  },
})
log.setLevel(GlobalConfig.logging.level)

export default log
