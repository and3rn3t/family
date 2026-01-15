/**
 * Data Backup Utilities
 * Export and import family organizer data
 */

import { FamilyMember, Chore, Event, MonthlyCompetition, WeeklyCompetition } from './types'

// Current data schema version - increment when structure changes
const SCHEMA_VERSION = 1

export interface BackupData {
  version: number
  exportedAt: string
  appName: string
  data: {
    members: FamilyMember[]
    chores: Chore[]
    events: Event[]
    monthlyCompetitions: MonthlyCompetition[]
    weeklyCompetitions: WeeklyCompetition[]
    settings: {
      familyName?: string
      theme?: string
      isDarkMode?: boolean
      soundEnabled?: boolean
    }
  }
}

export interface ImportResult {
  success: boolean
  message: string
  data?: BackupData['data']
  warnings?: string[]
}

/**
 * Create a backup of all app data
 */
export function createBackup(
  members: FamilyMember[],
  chores: Chore[],
  events: Event[],
  monthlyCompetitions: MonthlyCompetition[],
  weeklyCompetitions: WeeklyCompetition[],
  settings: BackupData['data']['settings'] = {}
): BackupData {
  return {
    version: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    appName: 'Family Organizer',
    data: {
      members,
      chores,
      events,
      monthlyCompetitions,
      weeklyCompetitions,
      settings,
    },
  }
}

/**
 * Download backup as JSON file
 */
export function downloadBackup(backup: BackupData): void {
  const json = JSON.stringify(backup, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const date = new Date().toISOString().split('T')[0]
  const filename = `family-organizer-backup-${date}.json`
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Validate and parse imported backup data
 */
export function validateBackup(jsonString: string): ImportResult {
  const warnings: string[] = []

  // Try to parse JSON
  let parsed: unknown
  try {
    parsed = JSON.parse(jsonString)
  } catch {
    return {
      success: false,
      message: 'Invalid JSON file. Please select a valid backup file.',
    }
  }

  // Check if it's an object
  if (!parsed || typeof parsed !== 'object') {
    return {
      success: false,
      message: 'Invalid backup format. Expected an object.',
    }
  }

  const backup = parsed as Record<string, unknown>

  // Check for app name (basic validation that it's our backup)
  if (backup.appName !== 'Family Organizer') {
    return {
      success: false,
      message: 'This doesn\'t appear to be a Family Organizer backup file.',
    }
  }

  // Check version
  if (typeof backup.version !== 'number') {
    warnings.push('Backup version not found, assuming compatible format.')
  } else if (backup.version > SCHEMA_VERSION) {
    return {
      success: false,
      message: `This backup was created with a newer version of the app (v${backup.version}). Please update the app first.`,
    }
  } else if (backup.version < SCHEMA_VERSION) {
    warnings.push(`Backup from older version (v${backup.version}), some data may need migration.`)
  }

  // Check data structure
  if (!backup.data || typeof backup.data !== 'object') {
    return {
      success: false,
      message: 'Backup data is missing or invalid.',
    }
  }

  const data = backup.data as Record<string, unknown>

  // Validate arrays exist
  const requiredArrays = ['members', 'chores', 'events', 'monthlyCompetitions', 'weeklyCompetitions']
  for (const key of requiredArrays) {
    if (!Array.isArray(data[key])) {
      data[key] = [] // Default to empty array if missing
      warnings.push(`${key} data was missing, defaulting to empty.`)
    }
  }

  // Validate members have required fields
  const members = data.members as FamilyMember[]
  const validMembers = members.filter((m) => m && typeof m.id === 'string' && typeof m.name === 'string')
  if (validMembers.length < members.length) {
    warnings.push(`${members.length - validMembers.length} invalid member(s) were skipped.`)
  }

  // Validate chores have required fields
  const chores = data.chores as Chore[]
  const validChores = chores.filter((c) => c && typeof c.id === 'string' && typeof c.title === 'string')
  if (validChores.length < chores.length) {
    warnings.push(`${chores.length - validChores.length} invalid chore(s) were skipped.`)
  }

  // Validate events
  const events = data.events as Event[]
  const validEvents = events.filter((e) => e && typeof e.id === 'string' && typeof e.title === 'string')
  if (validEvents.length < events.length) {
    warnings.push(`${events.length - validEvents.length} invalid event(s) were skipped.`)
  }

  return {
    success: true,
    message: 'Backup validated successfully.',
    data: {
      members: validMembers,
      chores: validChores,
      events: validEvents,
      monthlyCompetitions: (data.monthlyCompetitions as MonthlyCompetition[]) || [],
      weeklyCompetitions: (data.weeklyCompetitions as WeeklyCompetition[]) || [],
      settings: (data.settings as BackupData['data']['settings']) || {},
    },
    warnings: warnings.length > 0 ? warnings : undefined,
  }
}

/**
 * Read file as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

/**
 * Get backup file stats
 */
export function getBackupStats(data: BackupData['data']): {
  members: number
  chores: number
  events: number
  competitions: number
} {
  return {
    members: data.members.length,
    chores: data.chores.length,
    events: data.events.length,
    competitions: data.monthlyCompetitions.length + data.weeklyCompetitions.length,
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
