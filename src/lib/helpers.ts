import { ChoreFrequency, Chore, FamilyMember, MonthlyCompetition } from './types'

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

export const getStarsForChore = (frequency: ChoreFrequency): number => {
  const stars: Record<ChoreFrequency, number> = {
    daily: 1,
    weekly: 3,
    biweekly: 5,
    monthly: 10,
  }
  return stars[frequency]
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
