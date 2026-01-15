import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChoreWheel } from './ChoreWheel'
import { FamilyMember, Chore } from '@/lib/types'
import { Check } from '@phosphor-icons/react'

interface ChoreWheelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  members: FamilyMember[]
  chore?: Chore | null // If provided, assign this chore to the winner
  onAssignChore?: (choreId: string, memberId: string) => void
  soundEnabled?: boolean
}

export function ChoreWheelDialog({
  open,
  onOpenChange,
  members,
  chore,
  onAssignChore,
  soundEnabled = true,
}: ChoreWheelDialogProps) {
  const [winner, setWinner] = useState<FamilyMember | null>(null)
  const [hasAssigned, setHasAssigned] = useState(false)

  const handleResult = (member: FamilyMember) => {
    setWinner(member)
  }

  const handleAssign = () => {
    if (winner && chore && onAssignChore) {
      onAssignChore(chore.id, winner.id)
      setHasAssigned(true)
      // Close dialog after brief delay
      setTimeout(() => {
        onOpenChange(false)
      }, 1000)
    }
  }

  const handleClose = () => {
    // Reset state when closing
    setWinner(null)
    setHasAssigned(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading flex items-center gap-2">
            🎡 Chore Wheel
          </DialogTitle>
          <DialogDescription>
            {chore
              ? `Spin to decide who does "${chore.title}"!`
              : 'Spin the wheel to randomly pick a family member!'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ChoreWheel
            members={members}
            onResult={handleResult}
            soundEnabled={soundEnabled}
          />
        </div>

        {/* Assign button (only shows when there's a chore and a winner) */}
        {chore && winner && !hasAssigned && (
          <div className="flex justify-center">
            <Button onClick={handleAssign} size="lg" className="gap-2">
              <Check className="w-5 h-5" />
              Assign "{chore.title}" to {winner.name}
            </Button>
          </div>
        )}

        {hasAssigned && (
          <div className="text-center text-lg text-green-600 dark:text-green-400 font-semibold">
            ✅ Chore assigned!
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
