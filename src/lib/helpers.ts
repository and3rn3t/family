import { ChoreFrequency, Chore } from './types'

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
