import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="page" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2>Something went wrong</h2>
          <p style={{ color: 'var(--text-muted)', margin: '12px 0 24px' }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Refresh page
          </button>
          {import.meta.env.DEV && (
            <pre style={{
              marginTop: 24,
              textAlign: 'left',
              fontSize: 13,
              color: 'var(--danger)',
              background: 'var(--bg-soft)',
              padding: 16,
              borderRadius: 10,
              overflow: 'auto',
              maxWidth: 600,
              margin: '24px auto 0',
            }}>
              {this.state.error.message}
            </pre>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
