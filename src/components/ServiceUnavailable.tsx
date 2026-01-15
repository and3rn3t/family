import { WifiSlash, ArrowClockwise, CloudSlash } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

interface ServiceUnavailableProps {
  onRetry?: () => void
}

export function ServiceUnavailable({ onRetry }: ServiceUnavailableProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <CloudSlash className="w-10 h-10 text-amber-600 dark:text-amber-400" weight="fill" />
        </div>

        {/* Title and message */}
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Service Temporarily Unavailable
          </h1>
          <p className="text-muted-foreground">
            The data service is currently unavailable. This might be due to:
          </p>
          <ul className="text-sm text-muted-foreground text-left list-disc list-inside space-y-1 mt-4">
            <li>Rate limiting (too many requests)</li>
            <li>Network connectivity issues</li>
            <li>Service maintenance</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <Button onClick={handleRetry} className="w-full" size="lg">
            <ArrowClockwise className="w-5 h-5 mr-2" />
            Try Again
          </Button>
          
          <p className="text-xs text-muted-foreground">
            If the problem persists, wait a few minutes and try again.
          </p>
        </div>

        {/* Technical hint */}
        <details className="text-left bg-muted/50 rounded-lg p-4 text-sm">
          <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">
            <WifiSlash className="w-4 h-4 inline mr-2" />
            Technical Details
          </summary>
          <div className="mt-3 space-y-2 text-xs text-muted-foreground">
            <p>The Spark KV service returned 401 (Unauthorized) or rate limit errors.</p>
            <p>Try these steps:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Hard refresh: Ctrl+Shift+R (Win) or Cmd+Shift+R (Mac)</li>
              <li>Clear browser cache</li>
              <li>Restart the dev server</li>
              <li>Wait 1-2 minutes if rate limited</li>
            </ol>
          </div>
        </details>

        <p className="text-xs text-muted-foreground pt-4">
          Family Organizer • Your data is safe locally 🏠
        </p>
      </div>
    </div>
  )
}
