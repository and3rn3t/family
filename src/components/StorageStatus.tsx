/**
 * StorageStatus - Shows the current storage connection status
 */

import { CloudCheck, CloudSlash, CloudArrowUp } from '@phosphor-icons/react'
import { useStorageState } from '@/hooks/use-persisted-storage'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function StorageStatus() {
  const { isOnline, lastSaved, isLoading } = useStorageState()

  if (isLoading) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CloudArrowUp className="h-4 w-4 animate-pulse" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Connecting to server...</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const formatLastSaved = () => {
    if (!lastSaved) return 'Not saved yet'
    const now = new Date()
    const diff = now.getTime() - lastSaved.getTime()
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    return lastSaved.toLocaleTimeString()
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "flex items-center gap-1.5 text-xs",
              isOnline ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
            )}
          >
            {isOnline ? (
              <CloudCheck className="h-4 w-4" weight="fill" />
            ) : (
              <CloudSlash className="h-4 w-4" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {isOnline ? (
            <div className="text-center">
              <p className="font-medium">Connected to server</p>
              <p className="text-xs text-muted-foreground">
                Data is saved to disk
              </p>
              {lastSaved && (
                <p className="text-xs text-muted-foreground">
                  Last saved: {formatLastSaved()}
                </p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="font-medium">Local storage only</p>
              <p className="text-xs text-muted-foreground">
                Data saved in browser
              </p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
