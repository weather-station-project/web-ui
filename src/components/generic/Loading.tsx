import { memo } from 'react'
import { Spinner } from 'react-bootstrap'

const Loading = () => {
  return <Spinner animation="border" role="status" />
}

export default memo(Loading)
