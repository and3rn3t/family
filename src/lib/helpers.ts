import {
  Chore,
  ChoreDifficulty,
  ChoreFrequency,
  DayOfWeek,
  Event,
  FamilyMember,
  MonthlyCompetition,
  WeeklyCompetition,
} from './types'

export const getFrequencyLabel = (frequency: ChoreFrequency): string => {
  const labels: Record<ChoreFrequency, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    biweekly: 'Bi-weekly',
    monthly: 'Monthly',
  }
  return labels[frequency]
}

export const getFrequencyDays = (frequency: ChoreFrequency): number => {
  const days: Record<ChoreFrequency, number> = {
    daily: 1,
    weekly: 7,
    biweekly: 14,
    monthly: 30,
  }
  return days[frequency]
}

export const isChoreOverdue = (chore: Chore): boolean => {
  if (!chore.lastCompleted) return false

  const daysSinceCompletion = (Date.now() - chore.lastCompleted) / (1000 * 60 * 60 * 24)
  const frequencyDays = getFrequencyDays(chore.frequency)

  return daysSinceCompletion > frequencyDays
}

export const isChoreComplete = (chore: Chore): boolean => {
  if (!chore.lastCompleted) return false

  const daysSinceCompletion = (Date.now() - chore.lastCompleted) / (1000 * 60 * 60 * 24)
  const frequencyDays = getFrequencyDays(chore.frequency)

  return daysSinceCompletion <= frequencyDays
}

export const getNextDueDate = (chore: Chore): Date => {
  const baseDate = chore.lastCompleted || chore.createdAt
  const frequencyDays = getFrequencyDays(chore.frequency)
  return new Date(baseDate + frequencyDays * 24 * 60 * 60 * 1000)
}

export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const getBaseStarsForChore = (frequency: ChoreFrequency): number => {
  const stars: Record<ChoreFrequency, number> = {
    daily: 1,
    weekly: 3,
    biweekly: 5,
    monthly: 10,
  }
  return stars[frequency]
}

export const getDifficultyMultiplier = (difficulty: ChoreDifficulty): number => {
  const multipliers: Record<ChoreDifficulty, number> = {
    easy: 1,
    medium: 2,
    hard: 3,
  }
  return multipliers[difficulty]
}

export const getDifficultyLabel = (difficulty: ChoreDifficulty): string => {
  const labels: Record<ChoreDifficulty, string> = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
  }
  return labels[difficulty]
}

export const getDifficultyEmoji = (difficulty: ChoreDifficulty): string => {
  const emojis: Record<ChoreDifficulty, string> = {
    easy: '🟢',
    medium: '🟡',
    hard: '🔴',
  }
  return emojis[difficulty]
}

export const getStarsForChore = (
  frequency: ChoreFrequency,
  difficulty?: ChoreDifficulty
): number => {
  const baseStars = getBaseStarsForChore(frequency)
  const multiplier = getDifficultyMultiplier(difficulty || 'medium')
  return baseStars * multiplier
}

export const getCurrentMonthKey = (): string => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export const getMonthName = (monthKey: string): string => {
  const [year, month] = monthKey.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export const getMemberMonthlyStars = (member: FamilyMember, monthKey: string): number => {
  return member.monthlyStars?.[monthKey] || 0
}

export const isEndOfMonth = (): boolean => {
  const now = new Date()
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return now.getDate() === lastDayOfMonth.getDate()
}

export const getDaysUntilMonthEnd = (): number => {
  const now = new Date()
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const diff = lastDayOfMonth.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export const finalizeMonthlyCompetition = (
  members: FamilyMember[],
  monthKey: string
): MonthlyCompetition => {
  const rankings = members
    .map((member) => ({
      memberId: member.id,
      stars: getMemberMonthlyStars(member, monthKey),
    }))
    .sort((a, b) => b.stars - a.stars)

  const winner = rankings.length > 0 && rankings[0].stars > 0 ? rankings[0].memberId : undefined
  const [year, month] = monthKey.split('-')

  return {
    month: monthKey,
    year: parseInt(year),
    winner,
    rankings,
    completedAt: Date.now(),
  }
}

export const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

export const getCurrentWeekKey = (): string => {
  const now = new Date()
  const weekNumber = getWeekNumber(now)
  return `${now.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`
}

export const getWeekStartDate = (weekKey: string): Date => {
  const [year, weekStr] = weekKey.split('-W')
  const weekNumber = parseInt(weekStr)
  const firstDayOfYear = new Date(parseInt(year), 0, 1)
  const daysToAdd = (weekNumber - 1) * 7 - firstDayOfYear.getDay()
  return new Date(firstDayOfYear.getTime() + daysToAdd * 86400000)
}

export const getWeekEndDate = (weekKey: string): Date => {
  const startDate = getWeekStartDate(weekKey)
  return new Date(startDate.getTime() + 6 * 86400000)
}

export const getWeekLabel = (weekKey: string): string => {
  const [year, weekStr] = weekKey.split('-W')
  const weekNumber = parseInt(weekStr)
  const startDate = getWeekStartDate(weekKey)
  const endDate = getWeekEndDate(weekKey)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return `Week ${weekNumber}, ${year} (${formatDate(startDate)} - ${formatDate(endDate)})`
}

export const getMemberWeeklyStars = (member: FamilyMember, weekKey: string): number => {
  return member.weeklyStars?.[weekKey] || 0
}

export const getDaysUntilWeekEnd = (): number => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
  return daysUntilSunday
}

export const finalizeWeeklyCompetition = (
  members: FamilyMember[],
  weekKey: string
): WeeklyCompetition => {
  const rankings = members
    .map((member) => ({
      memberId: member.id,
      stars: getMemberWeeklyStars(member, weekKey),
    }))
    .sort((a, b) => b.stars - a.stars)

  const winner = rankings.length > 0 && rankings[0].stars > 0 ? rankings[0].memberId : undefined
  const [year, weekStr] = weekKey.split('-W')
  const weekNumber = parseInt(weekStr)

  return {
    week: weekKey,
    year: parseInt(year),
    weekNumber,
    winner,
    rankings,
    completedAt: Date.now(),
    startDate: getWeekStartDate(weekKey).getTime(),
    endDate: getWeekEndDate(weekKey).getTime(),
  }
}

export const getDayOfWeekFromDate = (date: Date): DayOfWeek => {
  const days: DayOfWeek[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ]
  return days[date.getDay()]
}

export const getDateDayOfWeek = (date: Date): number => {
  return date.getDay()
}

export const generateRecurringEventInstances = (
  baseEvent: Event,
  startDate: Date,
  endDate: Date
): Event[] => {
  if (baseEvent.recurrence === 'none') {
    return [baseEvent]
  }

  const instances: Event[] = []
  const eventDate = new Date(baseEvent.date)
  const maxEndDate = baseEvent.recurrenceEndDate
    ? new Date(Math.min(baseEvent.recurrenceEndDate, endDate.getTime()))
    : endDate

  let currentDate = new Date(eventDate)

  while (currentDate <= maxEndDate) {
    if (currentDate >= startDate) {
      const currentDayOfWeek = getDayOfWeekFromDate(currentDate)

      const shouldInclude =
        baseEvent.recurrence === 'weekly' &&
        baseEvent.recurringDays &&
        baseEvent.recurringDays.length > 0
          ? baseEvent.recurringDays.includes(currentDayOfWeek)
          : true

      if (shouldInclude) {
        instances.push({
          ...baseEvent,
          id: `${baseEvent.id}-${currentDate.getTime()}`,
          date: currentDate.getTime(),
          parentEventId: baseEvent.id,
        })
      }
    }

    if (baseEvent.recurrence === 'weekly') {
      if (baseEvent.recurringDays && baseEvent.recurringDays.length > 0) {
        currentDate = new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000)
      } else {
        currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      }
    } else if (baseEvent.recurrence === 'monthly') {
      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        currentDate.getDate()
      )
    }
  }

  return instances
}

export const getExpandedEvents = (events: Event[], monthsAhead: number = 3): Event[] => {
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  const endDate = new Date(now.getFullYear(), now.getMonth() + monthsAhead, 0)

  const expandedEvents: Event[] = []

  events.forEach((event) => {
    const eventInstances = generateRecurringEventInstances(event, startDate, endDate)
    expandedEvents.push(...eventInstances)
  })

  return expandedEvents.sort((a, b) => a.date - b.date)
}

// ============================================
// Streak Functions
// ============================================

export const getTodayDateKey = (): string => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export const getYesterdayDateKey = (): string => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
}

export const calculateNewStreak = (
  member: FamilyMember
): { currentStreak: number; bestStreak: number } => {
  const today = getTodayDateKey()
  const yesterday = getYesterdayDateKey()
  const lastCompletionDate = member.lastCompletionDate

  let currentStreak = member.currentStreak || 0
  let bestStreak = member.bestStreak || 0

  if (lastCompletionDate === today) {
    // Already completed today, no change to streak
    return { currentStreak, bestStreak }
  } else if (lastCompletionDate === yesterday) {
    // Consecutive day - increment streak
    currentStreak += 1
  } else {
    // Streak broken - reset to 1
    currentStreak = 1
  }

  // Update best streak if current is higher
  if (currentStreak > bestStreak) {
    bestStreak = currentStreak
  }

  return { currentStreak, bestStreak }
}

export const getStreakBonus = (streak: number): number => {
  // Bonus stars based on streak length
  if (streak >= 30) return 5 // 30+ day streak
  if (streak >= 14) return 3 // 2 week streak
  if (streak >= 7) return 2 // 1 week streak
  if (streak >= 3) return 1 // 3 day streak
  return 0 // No bonus for less than 3 days
}

export const getStreakLabel = (streak: number): string => {
  if (streak >= 30) return '🔥 Legendary'
  if (streak >= 14) return '🌟 Amazing'
  if (streak >= 7) return '⚡ Great'
  if (streak >= 3) return '✨ Nice'
  return ''
}

// ============================================
// Chore Rotation Functions
// ============================================

export const shouldRotateChore = (chore: Chore): boolean => {
  if (!chore.rotation || chore.rotation === 'none') return false
  if (!chore.rotationMembers || chore.rotationMembers.length < 2) return false

  const lastRotated = chore.lastRotated || chore.createdAt
  const now = Date.now()
  const daysSinceRotation = (now - lastRotated) / (1000 * 60 * 60 * 24)

  if (chore.rotation === 'weekly') {
    return daysSinceRotation >= 7
  } else if (chore.rotation === 'monthly') {
    return daysSinceRotation >= 30
  }

  return false
}

export const getNextRotationMember = (chore: Chore): string | null => {
  if (!chore.rotationMembers || chore.rotationMembers.length < 2) return null

  const currentIndex = chore.rotationMembers.indexOf(chore.assignedTo)
  if (currentIndex === -1) return chore.rotationMembers[0]

  const nextIndex = (currentIndex + 1) % chore.rotationMembers.length
  return chore.rotationMembers[nextIndex]
}

export const rotateChore = (chore: Chore): Chore => {
  const nextMember = getNextRotationMember(chore)
  if (!nextMember) return chore

  return {
    ...chore,
    assignedTo: nextMember,
    lastRotated: Date.now(),
  }
}

export const getRotationLabel = (rotation: string): string => {
  const labels: Record<string, string> = {
    none: 'No rotation',
    weekly: 'Weekly rotation',
    monthly: 'Monthly rotation',
  }
  return labels[rotation] || rotation
}

// ============================================
// Mystery Bonus Functions
// ============================================

export interface MysteryBonusState {
  activeDate: string | null // Date key when mystery bonus is active
  lastCheckedDate: string // Last date we checked for mystery bonus
}

const MYSTERY_BONUS_CHANCE = 0.15 // 15% chance each day

/**
 * Generates a deterministic "random" value for a given date
 * This ensures the same date always produces the same result
 */
export const getDateSeed = (dateKey: string): number => {
  let hash = 0
  for (let i = 0; i < dateKey.length; i++) {
    const char = dateKey.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  // Normalize to 0-1 range using a simple approach
  return Math.abs(hash % 1000) / 1000
}

/**
 * Check if today is a mystery bonus day
 * Uses deterministic randomness so all family members see the same result
 */
export const isMysteryBonusDay = (dateKey?: string): boolean => {
  const today = dateKey || getTodayDateKey()
  const seed = getDateSeed(today + '-mystery-bonus')
  return seed < MYSTERY_BONUS_CHANCE
}

/**
 * Get the mystery bonus multiplier (2x on bonus days, 1x otherwise)
 */
export const getMysteryBonusMultiplier = (): number => {
  return isMysteryBonusDay() ? 2 : 1
}

/**
 * Get a fun message for mystery bonus days
 */
export const getMysteryBonusMessage = (): string => {
  const messages = [
    "✨ It's a Mystery Bonus Day! Double stars on all chores!",
    '🎉 Lucky day! All chores are worth 2x stars today!',
    '⭐ Double Star Day activated! Make it count!',
    '🌟 Mystery Bonus unlocked! Every chore earns double!',
    "💫 Today's your lucky day - 2x stars on everything!",
  ]
  const seed = getDateSeed(getTodayDateKey())
  return messages[Math.floor(seed * messages.length)]
}
