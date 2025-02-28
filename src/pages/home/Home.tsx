import useSocket from '../../hooks/use-socket.ts'
import { Alert, Table } from 'react-bootstrap'
import { useState } from 'react'
import { Variant } from 'react-bootstrap/types'
import { useTranslation } from 'react-i18next'
import { GlobalConfig } from '../../config/config.ts'
import { Socket } from 'socket.io-client'
import { IAirMeasurement, IGroundTemperature, IRainfall, IWindMeasurement, reviver } from '../../models/models.ts'
import DisconnectReason = Socket.DisconnectReason
import { DATETIME_FORMAT_OPTIONS } from '../../helpers/i18next.ts'

const Home = () => {
  const { t } = useTranslation()

  // States
  const [showAlert, setShowAlert] = useState(false)
  const [alertType, setAlertType] = useState<Variant>()
  const [alertMessage, setAlertMessage] = useState<string>()
  const [socketConnected, setSocketConnected] = useState(false)
  const [airMeasurement, setAirMeasurement] = useState<IAirMeasurement>()
  const [groundTemperature, setGroundTemperature] = useState<IGroundTemperature>()
  const [windMeasurement, setWindMeasurement] = useState<IWindMeasurement>()
  const [rainfall, setRainfall] = useState<IRainfall>()

  // Callback methods
  const enableToast = (message: string, type: Variant): void => {
    setAlertType(type)
    setAlertMessage(message)
    setShowAlert(true)

    setTimeout((): void => {
      setShowAlert(false)
    }, GlobalConfig.times.toastDurationInMilliseconds)
  }

  const onConnect = (): void => {
    enableToast(t('home.socket-connected'), 'primary')
    setSocketConnected(true)
  }
  const onDisconnect = (reason: DisconnectReason): void => {
    enableToast(t('home.socket-disconnected', { reason: reason }), 'warning')
    setSocketConnected(false)
  }
  const onException = (message: string): void => {
    enableToast(t('home.socket-error', { message: message }), 'danger')
  }
  const onAirMeasurement = (message: string): void => {
    setAirMeasurement(JSON.parse(message, reviver))
  }
  const onGroundTemperature = (message: string): void => {
    setGroundTemperature(JSON.parse(message, reviver))
  }
  const onWindMeasurement = (message: string): void => {
    setWindMeasurement(JSON.parse(message, reviver))
  }
  const onRainfall = (message: string): void => {
    setRainfall(JSON.parse(message, reviver))
  }

  // Hooks
  useSocket(onConnect, onDisconnect, onException, onAirMeasurement, onGroundTemperature, onWindMeasurement, onRainfall)

  return (
    <>
      <h1>{t('home.real-time-measurements')}</h1>
      <p>{t('home.real-time-description')}</p>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>{t('home.socket-state')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{socketConnected ? <Alert variant="success">{t('home.connected')}</Alert> : <Alert variant="warning">{t('home.disconnected')}</Alert>}</td>
          </tr>
        </tbody>
      </Table>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>{t('home.measurement')}</th>
            <th>{t('home.value')}</th>
            <th>{t('home.last-received')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t('home.air-temperature')} (ºC)</td>
            <td>{airMeasurement?.temperature}</td>
            <td>{airMeasurement !== undefined && t('date', { value: airMeasurement?.dateTime, formatParams: { value: DATETIME_FORMAT_OPTIONS } })}</td>
          </tr>
          <tr>
            <td>{t('home.air-humidity')} (%)</td>
            <td>{airMeasurement?.humidity}</td>
            <td>{airMeasurement !== undefined && t('date', { value: airMeasurement?.dateTime, formatParams: { value: DATETIME_FORMAT_OPTIONS } })}</td>
          </tr>
          <tr>
            <td>{t('home.air-pressure')} (hPa)</td>
            <td>{airMeasurement?.pressure}</td>
            <td>{airMeasurement !== undefined && t('date', { value: airMeasurement?.dateTime, formatParams: { value: DATETIME_FORMAT_OPTIONS } })}</td>
          </tr>
          <tr>
            <td>{t('home.ground-temperature')} (ºC)</td>
            <td>{groundTemperature?.temperature}</td>
            <td>{groundTemperature !== undefined && t('date', { value: groundTemperature?.dateTime, formatParams: { value: DATETIME_FORMAT_OPTIONS } })}</td>
          </tr>
          <tr>
            <td>{t('home.wind-speed')} (km/h)</td>
            <td>{windMeasurement?.speed}</td>
            <td>{windMeasurement !== undefined && t('date', { value: windMeasurement?.dateTime, formatParams: { value: DATETIME_FORMAT_OPTIONS } })}</td>
          </tr>
          <tr>
            <td>{t('home.wind-direction')}</td>
            <td>{windMeasurement?.direction}</td>
            <td>{windMeasurement !== undefined && t('date', { value: windMeasurement?.dateTime, formatParams: { value: DATETIME_FORMAT_OPTIONS } })}</td>
          </tr>
          <tr>
            <td>{t('home.rainfall')} (l/m2)</td>
            <td>{rainfall?.amount}</td>
            <td>{rainfall !== undefined && t('date', { value: rainfall?.dateTime, formatParams: { value: DATETIME_FORMAT_OPTIONS } })}</td>
          </tr>
        </tbody>
      </Table>
      {showAlert && (
        <Alert key={alertType} variant={alertType} className="alert-bottom" dismissible>
          {alertMessage}
        </Alert>
      )}
    </>
  )
}

export default Home
