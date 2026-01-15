import { useState, useEffect } from 'react'
import { Warning, HardDrive, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { getStorageInfo, formatBytes, cleanupStorage } from '@/lib/storage-utils'
import { toast } from 'sonner'

interface StorageWarningProps {
  onDismiss?: () => void
}

export function StorageWarning({ onDismiss }: StorageWarningProps) {
  const [storageInfo, setStorageInfo] = useState(() => getStorageInfo())
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check storage periodically
    const interval = setInterval(() => {
      setStorageInfo(getStorageInfo())
    }, 60000) // Every minute

    return () => clearInterval(interval)
  }, [])

  const handleCleanup = () => {
    const result = cleanupStorage()
    if (result.freedBytes > 0) {
      toast.success(`Freed ${formatBytes(result.freedBytes)}`, {
        description: `Removed ${result.removedKeys.length} temporary items`,
      })
      setStorageInfo(getStorageInfo())
    } else {
      toast.info('No temporary data to clean up')
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  // Don't show if storage is fine or dismissed
  if (!storageInfo.isLow || dismissed) {
    return null
  }

  const bgColor = storageInfo.isCritical
    ? 'bg-red-500/90'
    : 'bg-amber-500/90'
  const textColor = storageInfo.isCritical
    ? 'text-red-950'
    : 'text-amber-950'

  return (
    <div className={`fixed bottom-16 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-lg ${bgColor} ${textColor} shadow-lg backdrop-blur-sm max-w-md`}>
      <div className="flex items-start gap-3">
        <Warning className="h-5 w-5 flex-shrink-0 mt-0.5" weight="fill" />
        <div className="flex-1">
          <p className="font-medium text-sm">
            {storageInfo.isCritical ? 'Storage Almost Full!' : 'Storage Running Low'}
          </p>
          <p className="text-xs opacity-80 mt-1">
            Using {formatBytes(storageInfo.used)} of ~{formatBytes(storageInfo.quota)} ({storageInfo.percentUsed.toFixed(0)}%)
          </p>
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              variant="secondary"
              className="h-7 text-xs"
              onClick={handleCleanup}
            >
              <HardDrive className="h-3 w-3 mr-1" />
              Clean Up
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={handleDismiss}
            >
              Dismiss
            </Button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-black/10 rounded"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

/**
 * Hook to check storage status
 */
export function useStorageStatus() {
  const [info, setInfo] = useState(() => getStorageInfo())

  useEffect(() => {
    const interval = setInterval(() => {
      setInfo(getStorageInfo())
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return info
}
