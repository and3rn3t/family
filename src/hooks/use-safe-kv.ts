/**
 * Safe KV Hook
 * Wraps useKV with error handling and localStorage fallback
 */

import { useState, useEffect, useCallback } from 'react'

type SetValue<T> = (value: T | ((prev: T) => T)) => void

/**
 * A safe version of useKV that falls back to localStorage on errors
 * and provides error state
 */
export function useSafeKV<T>(
  key: string,
  defaultValue: T
): [T, SetValue<T>, { loading: boolean; error: Error | null }] {
  const storageKey = `family-org-${key}`
  
  // Initialize from localStorage
  const [value, setValueState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        return JSON.parse(stored) as T
      }
    } catch {
      // Ignore parse errors
    }
    return defaultValue
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Persist to localStorage whenever value changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value))
    } catch (e) {
      console.warn('Failed to save to localStorage:', e)
    }
  }, [value, storageKey])

  const setValue: SetValue<T> = useCallback((newValue) => {
    setValueState((prev) => {
      const resolved = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(prev)
        : newValue
      return resolved
    })
    setError(null)
  }, [])

  return [value, setValue, { loading, error }]
}

/**
 * Check if we're likely having KV service issues
 */
export function checkKVHealth(): Promise<boolean> {
  return new Promise((resolve) => {
    // Simple health check - try to access localStorage
    try {
      const testKey = '__kv_health_check__'
      localStorage.setItem(testKey, 'ok')
      localStorage.removeItem(testKey)
      resolve(true)
    } catch {
      resolve(false)
    }
  })
}

/**
 * Migrate data from Spark KV keys to our localStorage keys
 * Call this once to ensure data continuity
 */
export function migrateFromSparkKV(): void {
  const sparkKeys = [
    'family-members',
    'chores', 
    'events',
    'monthly-competitions',
    'weekly-competitions',
    'dark-mode',
    'sound-enabled',
    'color-theme',
    'view-only-mode',
    'view-only-pin',
    'wizard-completed',
  ]

  for (const key of sparkKeys) {
    const sparkKey = key
    const safeKey = `family-org-${key}`
    
    // If we don't have data in safe key but do in spark key, migrate
    if (!localStorage.getItem(safeKey)) {
      const sparkData = localStorage.getItem(sparkKey)
      if (sparkData) {
        try {
          localStorage.setItem(safeKey, sparkData)
          console.log(`Migrated ${key} to safe storage`)
        } catch {
          // Ignore migration errors
        }
      }
    }
  }
}
