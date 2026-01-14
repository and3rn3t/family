export interface FamilyMember {
  id: string
  name: string
  color: string
  stars?: number
  achievements?: string[]
  monthlyStars?: Record<string, number>
  weeklyStars?: Record<string, number>
}

export type ChoreFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly'

export interface Chore {
  id: string
  title: string
  description: string
  frequency: ChoreFrequency
  assignedTo: string
  createdAt: number
  lastCompleted?: number
}

export interface ChoreCompletion {
  choreId: string
  completedAt: number
  completedBy: string
}

export interface MonthlyCompetition {
  month: string
  year: number
  winner?: string
  rankings: { memberId: string; stars: number }[]
  completedAt?: number
}

export interface WeeklyCompetition {
  week: string
  year: number
  weekNumber: number
  winner?: string
  rankings: { memberId: string; stars: number }[]
  completedAt?: number
  startDate: number
  endDate: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  condition: (member: FamilyMember, chores: Chore[], competitions: MonthlyCompetition[]) => boolean
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export type EventCategory = 'sports' | 'school' | 'medical' | 'social' | 'other'
export type RecurrenceType = 'none' | 'weekly' | 'monthly'

export interface Event {
  id: string
  title: string
  description: string
  category: EventCategory
  date: number
  time?: string
  assignedTo?: string
  allDay: boolean
  createdAt: number
  recurrence: RecurrenceType
  recurrenceEndDate?: number
  parentEventId?: string
}

export const AVATAR_COLORS = [
  'oklch(0.65 0.15 200)',
  'oklch(0.72 0.14 25)',
  'oklch(0.75 0.09 290)',
  'oklch(0.68 0.18 145)',
  'oklch(0.70 0.16 330)',
  'oklch(0.62 0.20 250)',
  'oklch(0.78 0.12 60)',
  'oklch(0.58 0.22 180)',
]
