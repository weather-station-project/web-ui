import { ReactNode } from 'react'
import { ErrorBoundary } from './ErrorBoundary.tsx'
import { Container } from 'react-bootstrap'
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
      <Container>{props.children}</Container>
    </>
  )
}

export default Layout
