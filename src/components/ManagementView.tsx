import { FamilyMember, Chore } from '@/lib/types'
import { MemberCard } from './MemberCard'
import { Button } from '@/components/ui/button'
import { Plus, FloppyDisk } from '@phosphor-icons/react'

interface ManagementViewProps {
  members: FamilyMember[]
  chores: Chore[]
  onAddMember: () => void
  onEditMember: (member: FamilyMember) => void
  onDeleteMember: (memberId: string) => void
  onOpenBackup: () => void
}

export function ManagementView({
  members,
  chores,
  onAddMember,
  onEditMember,
  onDeleteMember,
  onOpenBackup,
}: ManagementViewProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-tight">Family Members</h2>
          <p className="text-muted-foreground mt-1">
            Manage your family members and their chores
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onOpenBackup} size="lg" variant="outline">
            <FloppyDisk className="h-5 w-5 mr-2" />
            Backup
          </Button>
          <Button onClick={onAddMember} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <h3 className="font-heading text-2xl font-semibold">No Family Members Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Add your first family member to start organizing household chores.
          </p>
          <Button onClick={onAddMember} variant="outline" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Member
          </Button>
        </div>
      ) : (
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
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
