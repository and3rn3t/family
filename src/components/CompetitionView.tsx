import { FamilyMember, MonthlyCompetition, WeeklyCompetition } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MemberAvatar } from './MemberAvatar'
import { Trophy, Star, Medal, CalendarBlank, Fire, Lightning } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { 
  getCurrentMonthKey, 
  getCurrentWeekKey,
  getMonthName, 
  getMemberMonthlyStars,
  getMemberWeeklyStars,
  getDaysUntilMonthEnd,
  getDaysUntilWeekEnd,
  getWeekLabel
} from '@/lib/helpers'

interface CompetitionViewProps {
  members: FamilyMember[]
  competitions: MonthlyCompetition[]
  weeklyCompetitions: WeeklyCompetition[]
}

export function CompetitionView({ members, competitions, weeklyCompetitions }: CompetitionViewProps) {
  const currentMonthKey = getCurrentMonthKey()
  const currentMonthName = getMonthName(currentMonthKey)
  const daysUntilMonthEnd = getDaysUntilMonthEnd()

  const currentWeekKey = getCurrentWeekKey()
  const currentWeekLabel = getWeekLabel(currentWeekKey)
  const daysUntilWeekEnd = getDaysUntilWeekEnd()

  const currentMonthlyRankings = [...members]
    .map((member) => ({
      member,
      stars: getMemberMonthlyStars(member, currentMonthKey),
    }))
    .sort((a, b) => b.stars - a.stars)

  const currentWeeklyRankings = [...members]
    .map((member) => ({
      member,
      stars: getMemberWeeklyStars(member, currentWeekKey),
    }))
    .sort((a, b) => b.stars - a.stars)

  const pastMonthlyCompetitions = [...competitions]
    .filter((c) => c.completedAt)
    .sort((a, b) => b.year - a.year || b.month.localeCompare(a.month))

  const pastWeeklyCompetitions = [...weeklyCompetitions]
    .filter((c) => c.completedAt)
    .sort((a, b) => b.year - a.year || b.weekNumber - a.weekNumber)

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
          Competitions
        </h2>
        <p className="text-muted-foreground">
          Compete for the most stars weekly and monthly to earn bragging rights
        </p>
      </div>

      <Tabs defaultValue="weekly" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <Lightning weight="fill" className="h-4 w-4" />
            Weekly Sprint
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <Trophy weight="fill" className="h-4 w-4" />
            Monthly Marathon
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/20 border-primary/30">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-2xl font-bold">{currentWeekLabel}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <CalendarBlank className="h-4 w-4" />
                    <span className="text-sm">
                      {daysUntilWeekEnd === 0 ? 'Last day!' : `${daysUntilWeekEnd} ${daysUntilWeekEnd === 1 ? 'day' : 'days'} remaining`}
                    </span>
                  </div>
                </div>
                <Badge variant="default" className="text-lg px-4 py-2 bg-primary">
                  <Lightning weight="fill" className="h-5 w-5 mr-2" />
                  Active
                </Badge>
              </div>

              <div className="space-y-3">
                {currentWeeklyRankings.map((ranking, index) => (
                  <motion.div
                    key={ranking.member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
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
                        {index === 0 && ranking.stars > 0 ? '⚡ Leading' : `${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} Place`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-lg">
                      <Star weight="fill" className="h-6 w-6 text-primary" />
                      <span className="font-heading text-2xl font-bold">{ranking.stars}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {currentWeeklyRankings.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No participants yet. Start earning stars to compete!</p>
                </div>
              )}
            </div>
          </Card>

          {pastWeeklyCompetitions.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-heading text-2xl font-semibold">Past Weekly Sprints</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pastWeeklyCompetitions.slice(0, 9).map((competition) => {
                  const winner = members.find((m) => m.id === competition.winner)
                  return (
                    <Card key={competition.week} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-heading text-sm font-semibold">
                            {getWeekLabel(competition.week)}
                          </h4>
                          {winner && (
                            <Badge variant="default" className="gap-1 text-xs">
                              <Lightning weight="fill" className="h-3 w-3" />
                              Winner
                            </Badge>
                          )}
                        </div>

                        {winner && (
                          <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                            <MemberAvatar
                              name={winner.name}
                              color={winner.color}
                              size="sm"
                            />
                            <div className="flex-1">
                              <p className="font-heading font-semibold text-sm">{winner.name}</p>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Star weight="fill" className="h-4 w-4 text-primary" />
                              <span className="font-semibold">
                                {competition.rankings.find((r) => r.memberId === winner.id)?.stars || 0}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-secondary/10 to-accent/20 border-secondary/30">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-2xl font-bold">{currentMonthName}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <CalendarBlank className="h-4 w-4" />
                    <span className="text-sm">
                      {daysUntilMonthEnd} {daysUntilMonthEnd === 1 ? 'day' : 'days'} remaining
                    </span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Fire weight="fill" className="h-5 w-5 mr-2" />
                  Active
                </Badge>
              </div>

              <div className="space-y-3">
                {currentMonthlyRankings.map((ranking, index) => (
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

              {currentMonthlyRankings.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No participants yet. Start earning stars to compete!</p>
                </div>
              )}
            </div>
          </Card>

          {pastMonthlyCompetitions.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-heading text-2xl font-semibold">Past Monthly Marathons</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {pastMonthlyCompetitions.slice(0, 6).map((competition) => {
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
