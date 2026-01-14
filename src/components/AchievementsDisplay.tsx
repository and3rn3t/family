import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FamilyMember } from '@/lib/types'
import { ACHIEVEMENTS, getAchievementById, getRarityColor } from '@/lib/achievements'
import {
  Star,
  Trophy,
  CheckCircle,
  Fire,
  Lightning,
  TrendUp,
  Rocket,
  Sparkle,
} from '@phosphor-icons/react'

interface AchievementsDisplayProps {
  member: FamilyMember
  compact?: boolean
}

const iconMap: Record<string, React.ElementType> = {
  Star,
  Trophy,
  CheckCircle,
  Fire,
  Lightning,
  TrendUp,
  Rocket,
  Sparkle,
}

export function AchievementsDisplay({ member, compact = false }: AchievementsDisplayProps) {
  const earnedAchievements = (member.achievements || [])
    .map((id) => getAchievementById(id))
    .filter(Boolean)

  const totalAchievements = ACHIEVEMENTS.length
  const earnedCount = earnedAchievements.length

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Sparkle weight="fill" className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {earnedCount}/{totalAchievements} Achievements
        </span>
      </div>
    )
  }

  const getRarityLabel = (rarity: string) => {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1)
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkle weight="fill" className="h-6 w-6 text-secondary" />
            <h3 className="font-heading text-2xl font-semibold">Achievements</h3>
          </div>
          <Badge variant="outline" className="text-sm">
            {earnedCount} / {totalAchievements}
          </Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {ACHIEVEMENTS.map((achievement) => {
            const isEarned = member.achievements?.includes(achievement.id)
            const Icon = iconMap[achievement.icon] || Star
            const rarityColor = getRarityColor(achievement.rarity)

            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isEarned
                    ? 'bg-accent/30 border-accent hover:bg-accent/40'
                    : 'bg-muted/20 border-muted opacity-60 grayscale'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isEarned ? 'bg-secondary/20' : 'bg-muted'
                    }`}
                    style={
                      isEarned
                        ? {
                            backgroundColor: `${rarityColor}20`,
                            color: rarityColor,
                          }
                        : undefined
                    }
                  >
                    <Icon weight="fill" className="h-6 w-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-heading font-semibold text-sm">
                        {achievement.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className="text-xs px-1.5 py-0"
                        style={{
                          borderColor: rarityColor,
                          color: rarityColor,
                        }}
                      >
                        {getRarityLabel(achievement.rarity)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
