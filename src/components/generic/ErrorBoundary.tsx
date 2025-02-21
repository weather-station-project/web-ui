import { Component, ErrorInfo, ReactNode } from 'react'
import { Alert } from 'react-bootstrap'

interface IProps {
  children: ReactNode
}

interface IErrorInformation {
  error: Error
  errorInfo: ErrorInfo
}

export class ErrorBoundary extends Component<IProps> {
  state: IErrorInformation = {} as IErrorInformation

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    } as IErrorInformation)
  }

  render(): ReactNode {
    if (this.state.errorInfo) {
      return (
        <Alert variant="danger">
          <Alert.Heading>{this.state.error && this.state.error.toString()}</Alert.Heading>
          <p> {this.state.errorInfo.componentStack}</p>
        </Alert>
      )
    }

    return this.props.children
  }
}
