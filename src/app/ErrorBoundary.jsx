import React from 'react'
import { ErrorFallback } from '../shared/ui/ErrorFallback.jsx'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application crash:', error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.reset} />
    }

    return this.props.children
  }
}
