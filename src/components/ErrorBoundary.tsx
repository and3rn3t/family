import { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary component that catches JavaScript errors in child components
 * and displays a fallback UI instead of crashing the whole app.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo })
    
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error)
    console.error('Component stack:', errorInfo.componentStack)
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
    this.props.onReset?.()
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      )
    }

    return this.props.children
  }
}

// ===========================================
// Error Fallback UI Component
// ===========================================

interface ErrorFallbackProps {
  error: Error | null
  errorInfo: ErrorInfo | null
  onReset: () => void
  title?: string
  compact?: boolean
}

export function ErrorFallback({
  error,
  errorInfo,
  onReset,
  title = 'Something went wrong',
  compact = false,
}: ErrorFallbackProps) {
  const handleReload = () => {
    window.location.reload()
  }

  const handleClearDataAndReload = () => {
    if (confirm('This will clear all your family data. Are you sure?')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  if (compact) {
    return (
      <div className="flex items-center justify-center p-4 rounded-lg bg-destructive/10 border border-destructive/20">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-destructive">⚠️ {title}</p>
          <button
            onClick={onReset}
            className="text-xs text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[300px] flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <span className="text-3xl">😵</span>
        </div>

        {/* Title and message */}
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            {title}
          </h2>
          <p className="text-muted-foreground">
            Don't worry, your data is safe. Try one of these options:
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onReset}
            className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            🔄 Try Again
          </button>
          
          <button
            onClick={handleReload}
            className="w-full px-4 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
          >
            🔃 Reload Page
          </button>
        </div>

        {/* Error details (collapsible) */}
        {error && (
          <details className="text-left bg-muted/50 rounded-lg p-4">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              🔍 Technical Details
            </summary>
            <div className="mt-3 space-y-2">
              <div className="p-2 rounded bg-background font-mono text-xs break-all">
                <p className="font-semibold text-destructive">{error.name}: {error.message}</p>
              </div>
              {errorInfo?.componentStack && (
                <pre className="p-2 rounded bg-background font-mono text-xs overflow-auto max-h-32 text-muted-foreground">
                  {errorInfo.componentStack}
                </pre>
              )}
            </div>
          </details>
        )}

        {/* Last resort */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">
            Still having issues?
          </p>
          <button
            onClick={handleClearDataAndReload}
            className="text-xs text-destructive hover:underline"
          >
            Reset app and clear all data
          </button>
        </div>
      </div>
    </div>
  )
}

// ===========================================
// Specialized Error Boundaries
// ===========================================

interface SectionErrorBoundaryProps {
  children: ReactNode
  section: string
}

/**
 * A compact error boundary for individual sections/cards
 */
export function SectionErrorBoundary({ children, section }: SectionErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
          <div className="flex items-center gap-2 text-destructive">
            <span>⚠️</span>
            <span className="text-sm font-medium">Error loading {section}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-xs text-primary hover:underline"
          >
            Reload page to fix
          </button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
