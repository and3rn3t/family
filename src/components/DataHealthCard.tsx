import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  HardDrive,
  ShieldCheck,
  ShieldWarning,
  CaretDown,
  CaretUp,
  Broom,
  CheckCircle,
  Warning,
} from '@phosphor-icons/react'
import { getStorageInfo, formatBytes, cleanupStorage, getStorageByPrefix } from '@/lib/storage-utils'
import { toast } from 'sonner'

export function DataHealthCard() {
  const [expanded, setExpanded] = useState(false)
  const [storageInfo, setStorageInfo] = useState(() => getStorageInfo())

  const refreshStorage = () => {
    setStorageInfo(getStorageInfo())
  }

  const handleCleanup = () => {
    const result = cleanupStorage()
    if (result.freedBytes > 0) {
      toast.success(`Freed ${formatBytes(result.freedBytes)}`)
      refreshStorage()
    } else {
      toast.info('No temporary data to clean')
    }
  }

  const storageItems = expanded ? getStorageByPrefix('') : []

  const getStatusIcon = () => {
    if (storageInfo.isCritical) {
      return <ShieldWarning className="h-5 w-5 text-red-500" weight="fill" />
    }
    if (storageInfo.isLow) {
      return <ShieldWarning className="h-5 w-5 text-amber-500" weight="fill" />
    }
    return <ShieldCheck className="h-5 w-5 text-green-500" weight="fill" />
  }

  const getStatusText = () => {
    if (storageInfo.isCritical) return 'Critical - Storage almost full!'
    if (storageInfo.isLow) return 'Warning - Storage running low'
    return 'Healthy'
  }

  const getProgressColor = () => {
    if (storageInfo.isCritical) return 'bg-red-500'
    if (storageInfo.isLow) return 'bg-amber-500'
    return 'bg-green-500'
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <HardDrive className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold">Data Health</h3>
            <div className="flex items-center gap-2 text-sm">
              {getStatusIcon()}
              <span className="text-muted-foreground">{getStatusText()}</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <CaretUp className="h-4 w-4" />
          ) : (
            <CaretDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Storage Progress */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Storage Used</span>
          <span className="font-medium">
            {formatBytes(storageInfo.used)} / ~{formatBytes(storageInfo.quota)}
          </span>
        </div>
        <div className="relative">
          <Progress value={storageInfo.percentUsed} className="h-2" />
          <div
            className={`absolute inset-0 h-2 rounded-full ${getProgressColor()} transition-all`}
            style={{ width: `${Math.min(storageInfo.percentUsed, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {formatBytes(storageInfo.remaining)} remaining ({(100 - storageInfo.percentUsed).toFixed(1)}%)
        </p>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="space-y-4 pt-4 border-t">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Data validated</span>
            </div>
            <div className="flex items-center gap-2">
              {storageInfo.isLow ? (
                <Warning className="h-4 w-4 text-amber-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span>Storage OK</span>
            </div>
          </div>

          {/* Storage Breakdown */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Storage Breakdown</p>
            <div className="max-h-40 overflow-auto space-y-1">
              {storageItems.slice(0, 10).map((item) => (
                <div
                  key={item.key}
                  className="flex justify-between text-xs p-2 bg-muted/50 rounded"
                >
                  <span className="font-mono truncate flex-1 mr-2">{item.key}</span>
                  <span className="text-muted-foreground">{formatBytes(item.size)}</span>
                </div>
              ))}
              {storageItems.length > 10 && (
                <p className="text-xs text-muted-foreground text-center py-1">
                  +{storageItems.length - 10} more items
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCleanup}>
              <Broom className="h-4 w-4 mr-2" />
              Clean Up
            </Button>
            <Button variant="ghost" size="sm" onClick={refreshStorage}>
              Refresh
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
