import { ChoreFrequency, Chore, FamilyMember, MonthlyCompetition, WeeklyCompetition } from './types'

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
