/**
 * Data Validation Utilities
 * Ensures data integrity when loading from localStorage
 */

import { FamilyMember, Chore, Event, MonthlyCompetition, WeeklyCompetition } from './types'

export interface ValidationResult {
  valid: boolean
  data: unknown
  errors: string[]
  fixed: boolean
}

/**
 * Validate and fix a FamilyMember object
 */
export function validateMember(member: unknown): ValidationResult {
  const errors: string[] = []
  let fixed = false

  if (!member || typeof member !== 'object') {
    return { valid: false, data: null, errors: ['Invalid member data'], fixed: false }
  }

  const m = member as Record<string, unknown>

  // Required fields
  if (typeof m.id !== 'string' || !m.id) {
    return { valid: false, data: null, errors: ['Member missing id'], fixed: false }
  }
  if (typeof m.name !== 'string' || !m.name) {
    return { valid: false, data: null, errors: ['Member missing name'], fixed: false }
  }

  // Fix optional fields with defaults
  if (typeof m.color !== 'string') {
    m.color = '#6366f1'
    fixed = true
    errors.push('Fixed missing color')
  }
  if (typeof m.stars !== 'number' || isNaN(m.stars)) {
    m.stars = 0
    fixed = true
    errors.push('Fixed invalid stars')
  }
  if (!Array.isArray(m.achievements)) {
    m.achievements = []
    fixed = true
    errors.push('Fixed missing achievements')
  }
  if (typeof m.monthlyStars !== 'object' || m.monthlyStars === null) {
    m.monthlyStars = {}
    fixed = true
  }
  if (typeof m.weeklyStars !== 'object' || m.weeklyStars === null) {
    m.weeklyStars = {}
    fixed = true
  }
  if (typeof m.currentStreak !== 'number' || isNaN(m.currentStreak)) {
    m.currentStreak = 0
    fixed = true
  }
  if (typeof m.bestStreak !== 'number' || isNaN(m.bestStreak)) {
    m.bestStreak = 0
    fixed = true
  }

  return { valid: true, data: m as FamilyMember, errors, fixed }
}

/**
 * Validate and fix a Chore object
 */
export function validateChore(chore: unknown): ValidationResult {
  const errors: string[] = []
  let fixed = false

  if (!chore || typeof chore !== 'object') {
    return { valid: false, data: null, errors: ['Invalid chore data'], fixed: false }
  }

  const c = chore as Record<string, unknown>

  // Required fields
  if (typeof c.id !== 'string' || !c.id) {
    return { valid: false, data: null, errors: ['Chore missing id'], fixed: false }
  }
  if (typeof c.title !== 'string' || !c.title) {
    return { valid: false, data: null, errors: ['Chore missing title'], fixed: false }
  }
  if (typeof c.assignedTo !== 'string') {
    return { valid: false, data: null, errors: ['Chore missing assignedTo'], fixed: false }
  }

  // Fix optional fields
  if (typeof c.description !== 'string') {
    c.description = ''
    fixed = true
  }
  if (!['daily', 'weekly', 'biweekly', 'monthly'].includes(c.frequency as string)) {
    c.frequency = 'daily'
    fixed = true
    errors.push('Fixed invalid frequency')
  }
  if (!['easy', 'medium', 'hard'].includes(c.difficulty as string)) {
    c.difficulty = 'medium'
    fixed = true
  }
  if (typeof c.createdAt !== 'number') {
    c.createdAt = Date.now()
    fixed = true
  }

  return { valid: true, data: c as Chore, errors, fixed }
}

/**
 * Validate and fix an Event object
 */
export function validateEvent(event: unknown): ValidationResult {
  const errors: string[] = []
  let fixed = false

  if (!event || typeof event !== 'object') {
    return { valid: false, data: null, errors: ['Invalid event data'], fixed: false }
  }

  const e = event as Record<string, unknown>

  // Required fields
  if (typeof e.id !== 'string' || !e.id) {
    return { valid: false, data: null, errors: ['Event missing id'], fixed: false }
  }
  if (typeof e.title !== 'string' || !e.title) {
    return { valid: false, data: null, errors: ['Event missing title'], fixed: false }
  }
  if (typeof e.date !== 'string' || !e.date) {
    return { valid: false, data: null, errors: ['Event missing date'], fixed: false }
  }

  // Fix optional fields
  if (typeof e.description !== 'string') {
    e.description = ''
    fixed = true
  }
  if (!['sports', 'school', 'medical', 'social', 'other'].includes(e.category as string)) {
    e.category = 'other'
    fixed = true
  }
  if (typeof e.allDay !== 'boolean') {
    e.allDay = true
    fixed = true
  }
  if (!['none', 'weekly', 'monthly'].includes(e.recurrence as string)) {
    e.recurrence = 'none'
    fixed = true
  }

  return { valid: true, data: e as Event, errors, fixed }
}

/**
 * Validate an array of items
 */
export function validateArray<T>(
  items: unknown,
  validator: (item: unknown) => ValidationResult,
  itemName: string
): { valid: T[]; errors: string[]; removedCount: number; fixedCount: number } {
  const errors: string[] = []
  const valid: T[] = []
  let removedCount = 0
  let fixedCount = 0

  if (!Array.isArray(items)) {
    errors.push(`${itemName} is not an array, resetting to empty`)
    return { valid: [], errors, removedCount: 0, fixedCount: 0 }
  }

  for (const item of items) {
    const result = validator(item)
    if (result.valid && result.data) {
      valid.push(result.data as T)
      if (result.fixed) {
        fixedCount++
      }
    } else {
      removedCount++
      errors.push(...result.errors)
    }
  }

  return { valid, errors, removedCount, fixedCount }
}

/**
 * Validate all app data
 */
export function validateAllData(data: {
  members?: unknown
  chores?: unknown
  events?: unknown
  monthlyCompetitions?: unknown
  weeklyCompetitions?: unknown
}): {
  members: FamilyMember[]
  chores: Chore[]
  events: Event[]
  monthlyCompetitions: MonthlyCompetition[]
  weeklyCompetitions: WeeklyCompetition[]
  errors: string[]
  hadIssues: boolean
} {
  const allErrors: string[] = []
  let hadIssues = false

  // Validate members
  const membersResult = validateArray<FamilyMember>(
    data.members,
    validateMember,
    'Family members'
  )
  if (membersResult.removedCount > 0 || membersResult.fixedCount > 0) {
    hadIssues = true
    allErrors.push(...membersResult.errors)
  }

  // Validate chores
  const choresResult = validateArray<Chore>(
    data.chores,
    validateChore,
    'Chores'
  )
  if (choresResult.removedCount > 0 || choresResult.fixedCount > 0) {
    hadIssues = true
    allErrors.push(...choresResult.errors)
  }

  // Remove chores assigned to non-existent members
  const validMemberIds = new Set(membersResult.valid.map(m => m.id))
  const validChores = choresResult.valid.filter(c => {
    if (!validMemberIds.has(c.assignedTo)) {
      allErrors.push(`Removed chore "${c.title}" - assigned member not found`)
      hadIssues = true
      return false
    }
    return true
  })

  // Validate events
  const eventsResult = validateArray<Event>(
    data.events,
    validateEvent,
    'Events'
  )
  if (eventsResult.removedCount > 0 || eventsResult.fixedCount > 0) {
    hadIssues = true
    allErrors.push(...eventsResult.errors)
  }

  // Simple validation for competitions (just ensure they're arrays)
  const monthlyCompetitions = Array.isArray(data.monthlyCompetitions)
    ? (data.monthlyCompetitions as MonthlyCompetition[])
    : []
  const weeklyCompetitions = Array.isArray(data.weeklyCompetitions)
    ? (data.weeklyCompetitions as WeeklyCompetition[])
    : []

  return {
    members: membersResult.valid,
    chores: validChores,
    events: eventsResult.valid,
    monthlyCompetitions,
    weeklyCompetitions,
    errors: allErrors,
    hadIssues,
  }
}

/**
 * Check for duplicate IDs
 */
export function findDuplicateIds<T extends { id: string }>(items: T[]): string[] {
  const seen = new Set<string>()
  const duplicates: string[] = []
  
  for (const item of items) {
    if (seen.has(item.id)) {
      duplicates.push(item.id)
    }
    seen.add(item.id)
  }
  
  return duplicates
}

/**
 * Remove duplicates by ID, keeping the first occurrence
 */
export function removeDuplicates<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>()
  return items.filter(item => {
    if (seen.has(item.id)) {
      return false
    }
    seen.add(item.id)
    return true
  })
}
