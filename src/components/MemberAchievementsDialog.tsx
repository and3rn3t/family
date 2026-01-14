import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FamilyMember } from '@/lib/types'
import { AchievementsDisplay } from './AchievementsDisplay'
import { MemberAvatar } from './MemberAvatar'

interface MemberAchievementsDialogProps {
  member: FamilyMember | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MemberAchievementsDialog({
  member,
  open,
  onOpenChange,
}: MemberAchievementsDialogProps) {
  if (!member) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <MemberAvatar name={member.name} color={member.color} size="md" />
            <span className="font-heading text-2xl">{member.name}'s Achievements</span>
          </DialogTitle>
        </DialogHeader>
        <AchievementsDisplay member={member} />
      </DialogContent>
    </Dialog>
  )
}
