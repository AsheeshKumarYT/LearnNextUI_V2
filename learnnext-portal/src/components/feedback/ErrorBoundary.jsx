import { Component } from 'react';

/**
 * Catches render errors below it and shows `fallback(error, reset)` instead of a blank screen.
 * Changing `resetKey` (e.g. the current path) clears the error, so navigating away recovers.
 * <ErrorBoundary resetKey={pathname} fallback={(error, reset) => <PageCrash error={error} onReset={reset} />}>…</ErrorBoundary>
 */
export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Replace with your error reporting (Sentry, etc.)
    console.error('Unhandled UI error', error, info?.componentStack);
  }

  componentDidUpdate(prev) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.reset();
  }

  reset = () => this.setState({ error: null });

  render() {
    return this.state.error ? this.props.fallback(this.state.error, this.reset) : this.props.children;
  }
}
