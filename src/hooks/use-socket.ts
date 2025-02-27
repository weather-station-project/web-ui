import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { GlobalConfig } from '../config/config.ts'
import { getTokenByUserPassword, resetToken } from '../helpers/auth.ts'
import { Logger } from 'loglevel'
import retry, { RetryOperation } from 'retry'
import log from '../config/logging.ts'
import DisconnectReason = Socket.DisconnectReason

// https://github.com/ingka-group-digital/pmp-rx-player/blob/cdf5c964b5efdb95a0d1ccfb0bc98ea524f2e44d/src/helpers/socket.helpers.ts

interface ISocketError {
  status: string
  message: string
}

const useSocket = (
  onConnect: () => void,
  onDisconnect: (reason: DisconnectReason) => void,
  onException: (message: string) => void,
  onAirMeasurement: (message: string) => void,
  onGroundTemperature: (message: string) => void,
  onWindMeasurement: (message: string) => void,
  onRainfall: (message: string) => void
): Socket => {
  const logRef = useRef<Logger>(log.getLogger('socket'))
  const socketRef = useRef<Socket | null>(null)
  const tryingConnectionRef = useRef<boolean>(false)

  if (!socketRef.current) {
    socketRef.current = io(GlobalConfig.backend.socketUrl, {
      transports: ['websocket'],
      autoConnect: false,
      reconnection: false,
      auth: async (getTokenMethod): Promise<void> => {
        getTokenMethod({
          token: await getTokenByUserPassword(GlobalConfig.backend.backendUrl, { login: GlobalConfig.backend.login, password: GlobalConfig.backend.password }),
        })
      },
    })

    logRef.current.debug('Created socket helper instance')

    socketRef.current.on('connect', (): void => {
      logRef.current.debug('Socket connected')
      onConnect()
    })

    socketRef.current.on('disconnect', (reason: DisconnectReason): void => {
      logRef.current.debug(`Socket disconnected (${reason})`)
      onDisconnect(reason)
    })

    socketRef.current.on(GlobalConfig.socketEvents.exception, (message: string): void => {
      const error: ISocketError = JSON.parse(message)

      if (error.status === 'ws_error') {
        logRef.current.debug('Received WsException. Resetting token')
        resetToken()
      } else {
        logRef.current.error(`On exception event: ${JSON.stringify(error)}`)
      }

      onException(message)
    })

    socketRef.current.on(GlobalConfig.socketEvents.airMeasurement, (message: string): void => {
      logRef.current.debug(`Received air measurement: ${message}`)
      onAirMeasurement(message)
    })

    socketRef.current.on(GlobalConfig.socketEvents.groundTemperature, (message: string): void => {
      logRef.current.debug(`Received ground temperature: ${message}`)
      onGroundTemperature(message)
    })

    socketRef.current.on(GlobalConfig.socketEvents.windMeasurement, (message: string): void => {
      logRef.current.debug(`Received wind measurement: ${message}`)
      onWindMeasurement(message)
    })

    socketRef.current.on(GlobalConfig.socketEvents.rainfall, (message: string): void => {
      logRef.current.debug(`Received rainfall: ${message}`)
      onRainfall(message)
    })

    connect()
  }

  function connect(): void {
    if (tryingConnectionRef.current || socketRef.current?.connected) {
      return
    }

    tryingConnectionRef.current = true
    const operation: RetryOperation = retry.operation({
      retries: GlobalConfig.backend.maxAttempts - 1,
      minTimeout: GlobalConfig.backend.delayInMilliseconds,
      maxTimeout: GlobalConfig.backend.delayInMilliseconds * 3,
      randomize: true,
    })

    operation.attempt((currentAttempt: number): void => {
      if (socketRef.current?.connected) {
        return
      }
      logRef.current.debug(`Connecting socket. Attempt (${currentAttempt}/${GlobalConfig.backend.maxAttempts})`)
      socketRef.current?.connect()

      /*
      * retryOperation.retry(error)
        Returns false when no error value is given, or the maximum number of retries has been reached.
        Otherwise, it returns true, and retries the operation after the timeout for the current attempt number.
      * */
      if (!operation.retry(socketRef.current?.connected ? undefined : new Error('Not connected'))) {
        tryingConnectionRef.current = false
        if (operation.attempts() === GlobalConfig.backend.maxAttempts) {
          logRef.current.error(`Connection failed after ${GlobalConfig.backend.maxAttempts} attempts`)
        }
        return
      }
    })
  }

  useEffect(() => {
    const socket = socketRef.current
    const localLog = logRef.current

    return (): void => {
      if (socket) {
        localLog.debug('Destroying socket helper instance')
        socket.disconnect()
      }
    }
  }, [])

  return socketRef.current
}

export default useSocket
