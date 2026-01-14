import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MemberAvatar } from './MemberAvatar'
import { FamilyMember } from '@/lib/types'
import { Star, Trophy, Medal, Lightning, Fire } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { getCurrentMonthKey, getCurrentWeekKey, getMemberMonthlyStars, getMemberWeeklyStars } from '@/lib/helpers'

interface LeaderboardProps {
  members: FamilyMember[]
}

export function Leaderboard({ members }: LeaderboardProps) {
  const currentMonthKey = getCurrentMonthKey()
  const currentWeekKey = getCurrentWeekKey()

  const sortedByTotal = [...members].sort((a, b) => (b.stars || 0) - (a.stars || 0))
  
  const sortedByMonthly = [...members]
    .map((member) => ({
      member,
      stars: getMemberMonthlyStars(member, currentMonthKey),
    }))
    .sort((a, b) => b.stars - a.stars)

  const sortedByWeekly = [...members]
    .map((member) => ({
      member,
      stars: getMemberWeeklyStars(member, currentWeekKey),
    }))
    .sort((a, b) => b.stars - a.stars)

  if (members.length === 0) {
    return null
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy weight="fill" className="h-6 w-6 text-[oklch(0.72_0.14_25)]" />
    if (index === 1) return <Medal weight="fill" className="h-6 w-6 text-muted-foreground" />
    if (index === 2) return <Medal weight="fill" className="h-6 w-6 text-[oklch(0.72_0.14_25)]" />
    return <span className="text-lg font-semibold text-muted-foreground">#{index + 1}</span>
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy weight="fill" className="h-6 w-6 text-secondary" />
        <h3 className="font-heading text-2xl font-semibold">Leaderboard</h3>
      </div>

      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly" className="text-xs">
            <Lightning weight="fill" className="h-3 w-3 mr-1" />
            Week
          </TabsTrigger>
          <TabsTrigger value="monthly" className="text-xs">
            <Fire weight="fill" className="h-3 w-3 mr-1" />
            Month
          </TabsTrigger>
          <TabsTrigger value="total" className="text-xs">
            <Trophy weight="fill" className="h-3 w-3 mr-1" />
            All Time
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-3 mt-4">
          {sortedByWeekly.map((item, index) => (
            <motion.div
              key={item.member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <div className="flex items-center justify-center w-10">
                {getRankIcon(index)}
              </div>

              <MemberAvatar name={item.member.name} color={item.member.color} avatarUrl={item.member.avatarUrl} size="md" />

              <div className="flex-1">
                <h4 className="font-heading font-semibold">{item.member.name}</h4>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 bg-primary/20 rounded-lg">
                <Star weight="fill" className="h-5 w-5 text-primary" />
                <span className="font-heading text-xl font-bold">{item.stars}</span>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="monthly" className="space-y-3 mt-4">
          {sortedByMonthly.map((item, index) => (
            <motion.div
              key={item.member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors"
            >
              <div className="flex items-center justify-center w-10">
                {getRankIcon(index)}
              </div>

              <MemberAvatar name={item.member.name} color={item.member.color} avatarUrl={item.member.avatarUrl} size="md" />

              <div className="flex-1">
                <h4 className="font-heading font-semibold">{item.member.name}</h4>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 bg-secondary/20 rounded-lg">
                <Star weight="fill" className="h-5 w-5 text-secondary" />
                <span className="font-heading text-xl font-bold">{item.stars}</span>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="total" className="space-y-3 mt-4">
          {sortedByTotal.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center justify-center w-10">
                {getRankIcon(index)}
              </div>

              <MemberAvatar name={member.name} color={member.color} avatarUrl={member.avatarUrl} size="md" />

              <div className="flex-1">
                <h4 className="font-heading font-semibold">{member.name}</h4>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 bg-accent/50 rounded-lg">
                <Star weight="fill" className="h-5 w-5 text-secondary" />
                <span className="font-heading text-xl font-bold">{member.stars || 0}</span>
              </div>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </Card>
  )
}
