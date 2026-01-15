import { Button } from './components/ui/button'
import { Warning, ArrowClockwise, Trash, Bug, CloudSlash, WifiSlash } from '@phosphor-icons/react'
import { FallbackProps } from 'react-error-boundary'

// Check if this is a KV/service error
function isServiceError(error: Error): boolean {
  const message = error.message?.toLowerCase() || ''
  const name = error.name?.toLowerCase() || ''
  return (
    message.includes('unauthorized') ||
    message.includes('rate limit') ||
    message.includes('failed to fetch') ||
    message.includes('kv') ||
    message.includes('network') ||
    name.includes('networkerror')
  )
}

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const isKVError = isServiceError(error)
  const handleReload = () => {
    window.location.reload()
  }

  const handleClearData = () => {
    if (confirm('⚠️ This will delete ALL your family data (members, chores, events). This cannot be undone. Are you sure?')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const copyErrorDetails = () => {
    const details = `Error: ${error.name}\nMessage: ${error.message}\nStack: ${error.stack}`
    navigator.clipboard.writeText(details)
    alert('Error details copied to clipboard!')
  }

  // KV/Service error UI
  if (isKVError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <CloudSlash className="w-10 h-10 text-amber-600 dark:text-amber-400" weight="fill" />
            </div>
            
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground">
                Service Temporarily Unavailable
              </h1>
              <p className="text-muted-foreground mt-2">
                The data service is having issues. This is usually temporary.
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">Common causes:</p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Rate limiting (too many requests)</li>
              <li>Network connectivity issues</li>
              <li>Dev server needs restart</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button onClick={resetErrorBoundary} className="w-full h-12 text-lg" size="lg">
              <ArrowClockwise className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            
            <Button onClick={() => window.location.reload()} className="w-full" variant="secondary">
              🔄 Hard Refresh
            </Button>
          </div>

          <details className="text-left bg-muted/50 rounded-lg p-4 text-sm">
            <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">
              <WifiSlash className="w-4 h-4 inline mr-2" />
              Troubleshooting Steps
            </summary>
            <ol className="mt-3 list-decimal list-inside space-y-1 text-xs text-muted-foreground">
              <li>Wait 30 seconds and click "Try Again"</li>
              <li>Hard refresh: Ctrl+Shift+R (Win) or Cmd+Shift+R (Mac)</li>
              <li>Restart the dev server (npm run dev)</li>
              <li>Clear browser cache if problem persists</li>
            </ol>
          </details>

          <p className="text-center text-xs text-muted-foreground">
            Your data is stored locally and is safe 🏠
          </p>
        </div>
      </div>
    )
  }

  // General error UI
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <Warning className="w-10 h-10 text-destructive" weight="fill" />
          </div>
          
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Oops! Something broke
            </h1>
            <p className="text-muted-foreground mt-2">
              The Family Organizer ran into an unexpected error. Don't worry — your data is likely safe!
            </p>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="space-y-3">
          <Button 
            onClick={resetErrorBoundary} 
            className="w-full h-12 text-lg"
            size="lg"
          >
            <ArrowClockwise className="w-5 h-5 mr-2" />
            Try Again
          </Button>
          
          <Button 
            onClick={handleReload} 
            className="w-full"
            variant="secondary"
          >
            🔄 Reload Page
          </Button>
        </div>

        {/* Error Details */}
        <details className="bg-muted/50 rounded-lg border">
          <summary className="cursor-pointer p-4 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <Bug className="w-4 h-4" />
            Technical Details
          </summary>
          <div className="px-4 pb-4 space-y-3">
            <div className="bg-background rounded-md border p-3">
              <p className="text-xs font-mono text-destructive font-semibold">
                {error.name}: {error.message}
              </p>
            </div>
            {error.stack && (
              <pre className="text-xs text-muted-foreground bg-background p-3 rounded-md border overflow-auto max-h-40 font-mono">
                {error.stack}
              </pre>
            )}
            <Button
              onClick={copyErrorDetails}
              variant="outline"
              size="sm"
              className="w-full"
            >
              📋 Copy Error Details
            </Button>
          </div>
        </details>

        {/* Last Resort */}
        <div className="pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground mb-3">
            If the error keeps happening, you may need to reset the app:
          </p>
          <Button
            onClick={handleClearData}
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash className="w-4 h-4 mr-2" />
            Clear All Data & Start Fresh
          </Button>
        </div>

        {/* Branding */}
        <p className="text-center text-xs text-muted-foreground">
          Family Organizer • Something went wrong, but we've got your back! 🏠
        </p>
      </div>
    </div>
  )
}
