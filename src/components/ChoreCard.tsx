import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MemberAvatar } from './MemberAvatar'
import { Chore, FamilyMember } from '@/lib/types'
import { getFrequencyLabel, isChoreOverdue, isChoreComplete, getStarsForChore } from '@/lib/helpers'
import { Trash, PencilSimple, Star } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ChoreCardProps {
  chore: Chore
  member: FamilyMember | undefined
  onComplete: (choreId: string) => void
  onEdit: (chore: Chore) => void
  onDelete: (choreId: string) => void
}

export function ChoreCard({ chore, member, onComplete, onEdit, onDelete }: ChoreCardProps) {
  const isComplete = isChoreComplete(chore)
  const isOverdue = isChoreOverdue(chore)
  const stars = getStarsForChore(chore.frequency)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={cn(
          'p-4 transition-all duration-200 hover:shadow-lg',
          isComplete && 'bg-[oklch(0.95_0.05_290)] border-[oklch(0.75_0.09_290)]',
          isOverdue && !isComplete && 'border-accent border-2'
        )}
      >
        <div className="flex items-start gap-3">
          <Checkbox
            id={`chore-${chore.id}`}
            checked={isComplete}
            onCheckedChange={() => onComplete(chore.id)}
            className="mt-1"
          />
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <label
                htmlFor={`chore-${chore.id}`}
                className={cn(
                  'font-heading font-medium text-lg cursor-pointer',
                  isComplete && 'line-through text-muted-foreground'
                )}
              >
                {chore.title}
              </label>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-secondary/20 rounded-md">
                  <Star weight="fill" className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-semibold">{stars}</span>
                </div>
                {member && (
                  <MemberAvatar 
                    name={member.name} 
                    color={member.color}
                    avatarUrl={member.avatarUrl}
                    avatarIcon={member.avatarIcon}
                    size="sm" 
                  />
                )}
              </div>
            </div>
            
            {chore.description && (
              <p className={cn(
                'text-sm text-muted-foreground',
                isComplete && 'line-through'
              )}>
                {chore.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <Badge variant={isOverdue && !isComplete ? 'destructive' : 'secondary'}>
                {getFrequencyLabel(chore.frequency)}
              </Badge>
              
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(chore)}
                  className="h-8 w-8 p-0"
                >
                  <PencilSimple className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(chore.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
