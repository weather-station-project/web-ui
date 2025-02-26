import useSocket from '../../hooks/use-socket.ts'
import { Alert } from 'react-bootstrap'
import { useState } from 'react'
import { Variant } from 'react-bootstrap/types'

const Home = () => {
  // States
  const [showAlert, setShowAlert] = useState(false)
  const [alertType, setAlertType] = useState<Variant>()

  // Callback methods
  const onConnect = (): void => {
    setAlertType('primary')
    setShowAlert(true)
  }
  const onDisconnect = (): void => {}
  const onException = (message: string): void => {}
  const onAirMeasurement = (message: string): void => {}
  const onGroundTemperature = (message: string): void => {}
  const onWindMeasurement = (message: string): void => {}
  const onRainfall = (message: string): void => {}

  const socket = useSocket(onConnect, onDisconnect, onException, onAirMeasurement, onGroundTemperature, onWindMeasurement, onRainfall)

  return (
    <>
      <p>Home</p>
      {showAlert && (
        <Alert key={alertType} variant={alertType} dismissible>
          This is a alert—check it out!
        </Alert>
      )}
    </>
  )
}

export default Home
