import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode; fallback?: ReactNode }

// Catches errors in its children (e.g. the 3D scene failing to load) so the rest of the page
// keeps working. Shows `fallback` (default: nothing) instead of the broken part.
export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children
  }
}
