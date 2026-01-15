import { Achievement, FamilyMember, Chore, MonthlyCompetition } from './types'
import { isChoreComplete, getMemberMonthlyStars, getCurrentMonthKey } from './helpers'

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-star',
    title: 'First Star',
    description: 'Earn your first star',
    icon: 'Star',
    rarity: 'common',
    condition: (member) => (member.stars || 0) >= 1,
  },
  {
    id: 'star-collector',
    title: 'Star Collector',
    description: 'Earn 50 total stars',
    icon: 'Star',
    rarity: 'common',
    condition: (member) => (member.stars || 0) >= 50,
  },
  {
    id: 'star-master',
    title: 'Star Master',
    description: 'Earn 100 total stars',
    icon: 'Star',
    rarity: 'rare',
    condition: (member) => (member.stars || 0) >= 100,
  },
  {
    id: 'star-legend',
    title: 'Star Legend',
    description: 'Earn 250 total stars',
    icon: 'Star',
    rarity: 'epic',
    condition: (member) => (member.stars || 0) >= 250,
  },
  {
    id: 'monthly-champion',
    title: 'Monthly Champion',
    description: 'Win a monthly competition',
    icon: 'Trophy',
    rarity: 'rare',
    condition: (member, _chores, competitions) => {
      return competitions.some((comp) => comp.winner === member.id)
    },
  },
  {
    id: 'three-peat',
    title: 'Three-Peat',
    description: 'Win three consecutive monthly competitions',
    icon: 'Trophy',
    rarity: 'legendary',
    condition: (member, _chores, competitions) => {
      const sortedComps = [...competitions].sort((a, b) => b.year - a.year || b.month.localeCompare(a.month))
      if (sortedComps.length < 3) return false
      return (
        sortedComps[0].winner === member.id &&
        sortedComps[1].winner === member.id &&
        sortedComps[2].winner === member.id
      )
    },
  },
  {
    id: 'consistency-king',
    title: 'Consistency King',
    description: 'Earn at least 20 stars for 3 months in a row',
    icon: 'CheckCircle',
    rarity: 'epic',
    condition: (member) => {
      if (!member.monthlyStars) return false
      const months = Object.keys(member.monthlyStars).sort().reverse()
      if (months.length < 3) return false
      return months.slice(0, 3).every((month) => (member.monthlyStars?.[month] || 0) >= 20)
    },
  },
  {
    id: 'monthly-streak-5',
    title: 'Dedicated Worker',
    description: 'Earn stars in 5 consecutive months',
    icon: 'Fire',
    rarity: 'rare',
    condition: (member) => {
      if (!member.monthlyStars) return false
      const months = Object.keys(member.monthlyStars).sort().reverse()
      if (months.length < 5) return false
      return months.slice(0, 5).every((month) => (member.monthlyStars?.[month] || 0) > 0)
    },
  },
  {
    id: 'century-month',
    title: 'Century Month',
    description: 'Earn 100 stars in a single month',
    icon: 'Lightning',
    rarity: 'epic',
    condition: (member) => {
      if (!member.monthlyStars) return false
      return Object.values(member.monthlyStars).some((stars) => stars >= 100)
    },
  },
  {
    id: 'perfect-week',
    title: 'Perfect Week',
    description: 'Complete all assigned chores in a week',
    icon: 'CheckCircle',
    rarity: 'common',
    condition: (member, chores) => {
      const memberChores = chores.filter((c) => c.assignedTo === member.id)
      if (memberChores.length === 0) return false
      const completedChores = memberChores.filter(isChoreComplete)
      return completedChores.length === memberChores.length && memberChores.length > 0
    },
  },
  {
    id: 'comeback-kid',
    title: 'Comeback Kid',
    description: 'Win the monthly competition after being last the previous month',
    icon: 'TrendUp',
    rarity: 'epic',
    condition: (member, _chores, competitions) => {
      const sortedComps = [...competitions].sort((a, b) => b.year - a.year || b.month.localeCompare(a.month))
      if (sortedComps.length < 2) return false
      const currentWin = sortedComps[0].winner === member.id
      const lastMonthLast =
        sortedComps[1].rankings.length > 0 &&
        sortedComps[1].rankings[sortedComps[1].rankings.length - 1].memberId === member.id
      return currentWin && lastMonthLast
    },
  },
  {
    id: 'overachiever',
    title: 'Overachiever',
    description: 'Earn 50 stars in a single month',
    icon: 'Rocket',
    rarity: 'rare',
    condition: (member) => {
      if (!member.monthlyStars) return false
      return Object.values(member.monthlyStars).some((stars) => stars >= 50)
    },
  },
  // Mystery bonus achievements
  {
    id: 'lucky-star',
    title: 'Lucky Star',
    description: 'Complete a chore on a Mystery Bonus Day',
    icon: 'Sparkle',
    rarity: 'common',
    condition: (member) => (member.mysteryBonusCompletions || 0) >= 1,
  },
  {
    id: 'fortune-finder',
    title: 'Fortune Finder',
    description: 'Complete 5 chores on Mystery Bonus Days',
    icon: 'Sparkle',
    rarity: 'rare',
    condition: (member) => (member.mysteryBonusCompletions || 0) >= 5,
  },
  {
    id: 'mystery-master',
    title: 'Mystery Master',
    description: 'Complete 15 chores on Mystery Bonus Days',
    icon: 'Sparkle',
    rarity: 'epic',
    condition: (member) => (member.mysteryBonusCompletions || 0) >= 15,
  },

  // Streak achievements
  {
    id: 'streak-starter',
    title: 'Streak Starter',
    description: 'Complete chores 3 days in a row',
    icon: 'Fire',
    rarity: 'common',
    condition: (member) => (member.currentStreak || 0) >= 3 || (member.bestStreak || 0) >= 3,
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'Fire',
    rarity: 'rare',
    condition: (member) => (member.currentStreak || 0) >= 7 || (member.bestStreak || 0) >= 7,
  },
  {
    id: 'fortnight-fighter',
    title: 'Fortnight Fighter',
    description: 'Maintain a 14-day streak',
    icon: 'Fire',
    rarity: 'epic',
    condition: (member) => (member.currentStreak || 0) >= 14 || (member.bestStreak || 0) >= 14,
  },
  {
    id: 'streak-legend',
    title: 'Streak Legend',
    description: 'Maintain a 30-day streak',
    icon: 'Fire',
    rarity: 'legendary',
    condition: (member) => (member.currentStreak || 0) >= 30 || (member.bestStreak || 0) >= 30,
  },
]

export const checkNewAchievements = (
  member: FamilyMember,
  chores: Chore[],
  competitions: MonthlyCompetition[]
): Achievement[] => {
  const currentAchievements = member.achievements || []
  const newAchievements: Achievement[] = []

  for (const achievement of ACHIEVEMENTS) {
    if (currentAchievements.includes(achievement.id)) continue

    if (achievement.condition(member, chores, competitions)) {
      newAchievements.push(achievement)
    }
  }

  return newAchievements
}

export const getAchievementById = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find((a) => a.id === id)
}

export const getRarityColor = (rarity: Achievement['rarity']): string => {
  const colors = {
    common: 'oklch(0.5 0.02 280)',
    rare: 'oklch(0.65 0.15 200)',
    epic: 'oklch(0.72 0.14 25)',
    legendary: 'oklch(0.85 0.15 95)',
  }
  return colors[rarity]
}
