import { ReactNode } from 'react'
import { ErrorBoundary } from './ErrorBoundary.tsx'
import { Col, Container, Row } from 'react-bootstrap'
import NavigationMenu from '../menu/NavigationMenu.tsx'

interface IProps {
  children: ReactNode
}

const Layout = (props: IProps) => {
  return (
    <>
      <ErrorBoundary>
        <NavigationMenu />
      </ErrorBoundary>
      <Container className="mt-3">
        <Row>
          <Col>{props.children}</Col>
        </Row>
      </Container>
    </>
  )
}

export default Layout
