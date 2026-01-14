import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { MemberAvatar } from './MemberAvatar'
import { FamilyMember, Chore } from '@/lib/types'
import { isChoreComplete } from '@/lib/helpers'
import { PencilSimple, Trash, Star } from '@phosphor-icons/react'

interface MemberCardProps {
  member: FamilyMember
  chores: Chore[]
  onEdit: (member: FamilyMember) => void
  onDelete: (memberId: string) => void
}

export function MemberCard({ member, chores, onEdit, onDelete }: MemberCardProps) {
  const totalChores = chores.length
  const completedChores = chores.filter(isChoreComplete).length
  const completionPercentage = totalChores > 0 ? (completedChores / totalChores) * 100 : 0

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <MemberAvatar name={member.name} color={member.color} size="lg" />
          <div>
            <h3 className="font-heading font-semibold text-xl">{member.name}</h3>
            <p className="text-sm text-muted-foreground">
              {totalChores} {totalChores === 1 ? 'chore' : 'chores'} assigned
            </p>
          </div>
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(member)}
            className="h-8 w-8 p-0"
          >
            <PencilSimple className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(member.id)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-center py-3 px-4 bg-accent/50 rounded-lg">
        <Star weight="fill" className="h-6 w-6 text-secondary mr-2" />
        <span className="font-heading text-2xl font-bold">{member.stars || 0}</span>
        <span className="text-sm text-muted-foreground ml-2">stars</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold">
            {completedChores}/{totalChores}
          </span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>
    </Card>
  )
}
