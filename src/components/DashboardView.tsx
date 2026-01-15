import { FamilyMember, Chore } from '@/lib/types'
import { MemberCard } from './MemberCard'
import { ChoreCard } from './ChoreCard'
import { Leaderboard } from './Leaderboard'
import { Clock } from './Clock'
import { MysteryBonusBanner } from './MysteryBonusBanner'
import { Button } from '@/components/ui/button'
import { Plus } from '@phosphor-icons/react'
import { isChoreComplete, isMysteryBonusDay } from '@/lib/helpers'

interface DashboardViewProps {
  members: FamilyMember[]
  chores: Chore[]
  onCompleteChore: (choreId: string) => void
  onEditChore: (chore: Chore) => void
  onDeleteChore: (choreId: string) => void
  onEditMember: (member: FamilyMember) => void
  onDeleteMember: (memberId: string) => void
  onAddChore: () => void
  onViewAchievements?: (member: FamilyMember) => void
}

export function DashboardView({
  members,
  chores,
  onCompleteChore,
  onEditChore,
  onDeleteChore,
  onEditMember,
  onDeleteMember,
  onAddChore,
  onViewAchievements,
}: DashboardViewProps) {
  const totalChores = chores.length
  const completedChores = chores.filter(isChoreComplete).length
  const overallProgress = totalChores > 0 ? Math.round((completedChores / totalChores) * 100) : 0

  if (members.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h3 className="font-heading text-2xl font-semibold">No Family Members Yet</h3>
          <p className="text-muted-foreground max-w-md">
            Get started by adding your first family member in the Management tab.
          </p>
        </div>
      </div>
    )
  }

  const showMysteryBonus = isMysteryBonusDay()

  return (
    <div className="space-y-8">
      {/* Clock Display - Glanceable from across the room */}
      <div className="flex justify-center py-4">
        <Clock showDate={true} />
      </div>

      {/* Mystery Bonus Banner - Shows on lucky days */}
      {showMysteryBonus && (
        <MysteryBonusBanner />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-tight">Family Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            {overallProgress}% complete • {completedChores} of {totalChores} chores done
          </p>
        </div>
        <Button onClick={onAddChore} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Add Chore
        </Button>
      </div>

      <Leaderboard members={members} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => {
          const memberChores = chores.filter((c) => c.assignedTo === member.id)
          return (
            <MemberCard
              key={member.id}
              member={member}
              chores={memberChores}
              onEdit={onEditMember}
              onDelete={onDeleteMember}
              onViewAchievements={onViewAchievements}
            />
          )
        })}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-2xl font-semibold">All Chores</h3>
        </div>

        {chores.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <h4 className="font-heading text-xl font-semibold">No Chores Yet</h4>
            <p className="text-muted-foreground">
              Add your first chore to get started!
            </p>
            <Button onClick={onAddChore} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Chore
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {chores.map((chore) => {
              const member = members.find((m) => m.id === chore.assignedTo)
              return (
                <ChoreCard
                  key={chore.id}
                  chore={chore}
                  member={member}
                  onComplete={onCompleteChore}
                  onEdit={onEditChore}
                  onDelete={onDeleteChore}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
