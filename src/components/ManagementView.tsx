import { useState } from 'react'
import { FamilyMember, Chore } from '@/lib/types'
import { MemberCard } from './MemberCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, FloppyDisk, Lock, LockOpen, Eye, EyeSlash } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ManagementViewProps {
  members: FamilyMember[]
  chores: Chore[]
  onAddMember: () => void
  onEditMember: (member: FamilyMember) => void
  onDeleteMember: (memberId: string) => void
  onOpenBackup: () => void
  isViewOnly?: boolean
  onSetPin: (pin: string) => void
  currentPin: string
}

export function ManagementView({
  members,
  chores,
  onAddMember,
  onEditMember,
  onDeleteMember,
  onOpenBackup,
  isViewOnly = false,
  onSetPin,
  currentPin,
}: ManagementViewProps) {
  const [showPinSection, setShowPinSection] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [showPin, setShowPin] = useState(false)

  const handleSetPin = () => {
    if (newPin.length < 4) {
      toast.error('PIN must be at least 4 digits')
      return
    }
    if (newPin !== confirmPin) {
      toast.error('PINs do not match')
      return
    }
    onSetPin(newPin)
    setNewPin('')
    setConfirmPin('')
    setShowPinSection(false)
    toast.success('PIN set successfully', {
      description: 'View-only mode will now require this PIN to unlock.',
    })
  }

  const handleClearPin = () => {
    onSetPin('')
    toast.success('PIN removed', {
      description: 'View-only mode can now be unlocked without a PIN.',
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-tight">Family Members</h2>
          <p className="text-muted-foreground mt-1">
            Manage your family members and their chores
          </p>
        </div>
        {!isViewOnly && (
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
        )}
      </div>

      {members.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <h3 className="font-heading text-2xl font-semibold">No Family Members Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {isViewOnly ? 'No family members have been added.' : 'Add your first family member to start organizing household chores.'}
          </p>
          {!isViewOnly && (
            <Button onClick={onAddMember} variant="outline" size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Member
            </Button>
          )}
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
                isViewOnly={isViewOnly}
              />
            )
          })}
        </div>
      )}

      {/* View-Only Mode Settings */}
      {!isViewOnly && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                {currentPin ? (
                  <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" weight="fill" />
                ) : (
                  <LockOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">View-Only Mode Protection</h3>
                <p className="text-sm text-muted-foreground">
                  {currentPin ? 'PIN is set - view-only mode is protected' : 'No PIN set - anyone can exit view-only mode'}
                </p>
              </div>
            </div>
            {currentPin ? (
              <Button variant="outline" size="sm" onClick={handleClearPin}>
                Remove PIN
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowPinSection(!showPinSection)}>
                {showPinSection ? 'Cancel' : 'Set PIN'}
              </Button>
            )}
          </div>

          {showPinSection && !currentPin && (
            <div className="space-y-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Set a PIN to prevent accidental edits. When view-only mode is active, this PIN will be required to unlock editing.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">New PIN</label>
                  <div className="relative">
                    <Input
                      type={showPin ? 'text' : 'password'}
                      placeholder="Enter PIN"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="pr-10"
                      maxLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPin(!showPin)}
                    >
                      {showPin ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm PIN</label>
                  <Input
                    type={showPin ? 'text' : 'password'}
                    placeholder="Confirm PIN"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                  />
                </div>
              </div>
              <Button onClick={handleSetPin} disabled={newPin.length < 4 || newPin !== confirmPin}>
                <Lock className="h-4 w-4 mr-2" />
                Set PIN
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
