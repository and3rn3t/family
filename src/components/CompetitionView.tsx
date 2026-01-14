import { FamilyMember, MonthlyCompetition } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MemberAvatar } from './MemberAvatar'
import { Trophy, Star, Medal, CalendarBlank, Fire } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { 
  getCurrentMonthKey, 
  getMonthName, 
  getMemberMonthlyStars,
  getDaysUntilMonthEnd 
} from '@/lib/helpers'

interface CompetitionViewProps {
  members: FamilyMember[]
  competitions: MonthlyCompetition[]
}

export function CompetitionView({ members, competitions }: CompetitionViewProps) {
  const currentMonthKey = getCurrentMonthKey()
  const currentMonthName = getMonthName(currentMonthKey)
  const daysUntilEnd = getDaysUntilMonthEnd()

  const currentRankings = [...members]
    .map((member) => ({
      member,
      stars: getMemberMonthlyStars(member, currentMonthKey),
    }))
    .sort((a, b) => b.stars - a.stars)

  const pastCompetitions = [...competitions]
    .filter((c) => c.completedAt)
    .sort((a, b) => b.year - a.year || b.month.localeCompare(a.month))

  const getRankIcon = (index: number) => {
    if (index === 0)
      return <Trophy weight="fill" className="h-8 w-8 text-[oklch(0.85_0.15_95)]" />
    if (index === 1)
      return <Medal weight="fill" className="h-8 w-8 text-muted-foreground" />
    if (index === 2)
      return <Medal weight="fill" className="h-8 w-8 text-[oklch(0.72_0.14_25)]" />
    return <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
  }

  const getRankBgColor = (index: number) => {
    if (index === 0) return 'bg-[oklch(0.85_0.15_95)]/10 border-[oklch(0.85_0.15_95)]/30'
    if (index === 1) return 'bg-muted/50 border-muted'
    if (index === 2) return 'bg-[oklch(0.72_0.14_25)]/10 border-[oklch(0.72_0.14_25)]/30'
    return 'bg-card border-border'
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-heading text-3xl font-bold tracking-tight flex items-center gap-3">
          <Trophy weight="fill" className="h-8 w-8 text-secondary" />
          Monthly Competition
        </h2>
        <p className="text-muted-foreground">
          Compete for the most stars each month and earn special achievements
        </p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-secondary/10 to-accent/20 border-secondary/30">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-2xl font-bold">{currentMonthName}</h3>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <CalendarBlank className="h-4 w-4" />
                <span className="text-sm">
                  {daysUntilEnd} {daysUntilEnd === 1 ? 'day' : 'days'} remaining
                </span>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Fire weight="fill" className="h-5 w-5 mr-2" />
              Active
            </Badge>
          </div>

          <div className="space-y-3">
            {currentRankings.map((ranking, index) => (
              <motion.div
                key={ranking.member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 ${getRankBgColor(
                  index
                )} transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-center w-12">
                  {getRankIcon(index)}
                </div>

                <MemberAvatar
                  name={ranking.member.name}
                  color={ranking.member.color}
                  size="lg"
                />

                <div className="flex-1">
                  <h4 className="font-heading text-lg font-semibold">
                    {ranking.member.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {index === 0 && ranking.stars > 0 ? '🏆 Leading' : `${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} Place`}
                  </p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-lg">
                  <Star weight="fill" className="h-6 w-6 text-secondary" />
                  <span className="font-heading text-2xl font-bold">{ranking.stars}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {currentRankings.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No participants yet. Start earning stars to compete!</p>
            </div>
          )}
        </div>
      </Card>

      {pastCompetitions.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-heading text-2xl font-semibold">Past Competitions</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {pastCompetitions.slice(0, 6).map((competition) => {
              const winner = members.find((m) => m.id === competition.winner)
              return (
                <Card key={competition.month} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading text-lg font-semibold">
                        {getMonthName(competition.month)}
                      </h4>
                      {winner && (
                        <Badge variant="secondary" className="gap-1">
                          <Trophy weight="fill" className="h-3 w-3" />
                          Winner
                        </Badge>
                      )}
                    </div>

                    {winner && (
                      <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
                        <MemberAvatar
                          name={winner.name}
                          color={winner.color}
                          size="sm"
                        />
                        <div className="flex-1">
                          <p className="font-heading font-semibold">{winner.name}</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star weight="fill" className="h-4 w-4 text-secondary" />
                          <span className="font-semibold">
                            {competition.rankings.find((r) => r.memberId === winner.id)?.stars || 0}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      {competition.rankings.slice(0, 3).map((ranking, idx) => {
                        const member = members.find((m) => m.id === ranking.memberId)
                        if (!member || ranking.memberId === winner?.id) return null
                        return (
                          <div
                            key={ranking.memberId}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <span className="w-6">#{idx + 1}</span>
                            <span className="flex-1">{member.name}</span>
                            <span className="flex items-center gap-1">
                              <Star weight="fill" className="h-3 w-3" />
                              {ranking.stars}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
