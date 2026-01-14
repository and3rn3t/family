import { Card } from '@/components/ui/card'
import { MemberAvatar } from './MemberAvatar'
import { FamilyMember } from '@/lib/types'
import { Star, Trophy, Medal } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface LeaderboardProps {
  members: FamilyMember[]
}

export function Leaderboard({ members }: LeaderboardProps) {
  const sortedMembers = [...members].sort((a, b) => (b.stars || 0) - (a.stars || 0))

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

      <div className="space-y-3">
        {sortedMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center justify-center w-10">
              {getRankIcon(index)}
            </div>

            <MemberAvatar name={member.name} color={member.color} size="md" />

            <div className="flex-1">
              <h4 className="font-heading font-semibold">{member.name}</h4>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-secondary/20 rounded-lg">
              <Star weight="fill" className="h-5 w-5 text-secondary" />
              <span className="font-heading text-xl font-bold">{member.stars || 0}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
