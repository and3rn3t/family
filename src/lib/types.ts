export interface FamilyMember {
  id: string
  name: string
  color: string
  stars?: number
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
