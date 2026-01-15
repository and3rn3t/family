/**
 * Storage Utilities
 * Monitor localStorage usage and warn when running low
 */

export interface StorageInfo {
  used: number
  quota: number
  percentUsed: number
  remaining: number
  isLow: boolean
  isCritical: boolean
}

/**
 * Estimate localStorage quota and usage
 * Note: Browsers don't expose exact quota, so we estimate
 */
export function getStorageInfo(): StorageInfo {
  // Estimate used storage by serializing all localStorage
  let used = 0
  try {
    for (const key of Object.keys(localStorage)) {
      const value = localStorage.getItem(key)
      if (value) {
        // Each character is ~2 bytes in UTF-16
        used += (key.length + value.length) * 2
      }
    }
  } catch {
    used = 0
  }

  // Most browsers have 5-10MB quota, assume 5MB to be safe
  const quota = 5 * 1024 * 1024 // 5MB in bytes

  const percentUsed = (used / quota) * 100
  const remaining = quota - used
  const isLow = percentUsed > 70
  const isCritical = percentUsed > 90

  return {
    used,
    quota,
    percentUsed,
    remaining,
    isLow,
    isCritical,
  }
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * Test if we can write to localStorage
 */
export function canWriteToStorage(): boolean {
  const testKey = '__storage_test__'
  try {
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Try to write and check if we're hitting quota
 */
export function isStorageFull(): boolean {
  const testKey = '__storage_full_test__'
  const testValue = 'x'.repeat(1024) // 1KB test

  try {
    localStorage.setItem(testKey, testValue)
    localStorage.removeItem(testKey)
    return false
  } catch (e) {
    // QuotaExceededError
    return true
  }
}

/**
 * Get storage usage by key prefix
 */
export function getStorageByPrefix(prefix: string): { key: string; size: number }[] {
  const items: { key: string; size: number }[] = []

  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(prefix) || prefix === '') {
      const value = localStorage.getItem(key)
      if (value) {
        items.push({
          key,
          size: (key.length + value.length) * 2,
        })
      }
    }
  }

  return items.sort((a, b) => b.size - a.size)
}

/**
 * Clean up old/unnecessary data to free space
 */
export function cleanupStorage(): { freedBytes: number; removedKeys: string[] } {
  const removedKeys: string[] = []
  let freedBytes = 0

  // Remove any temporary or test keys
  const keysToRemove = Object.keys(localStorage).filter(
    key => key.startsWith('__') || key.includes('_temp_') || key.includes('_test_')
  )

  for (const key of keysToRemove) {
    const value = localStorage.getItem(key)
    if (value) {
      freedBytes += (key.length + value.length) * 2
      localStorage.removeItem(key)
      removedKeys.push(key)
    }
  }

  return { freedBytes, removedKeys }
}
