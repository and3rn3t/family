import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FamilyMember, AVATAR_COLORS } from '@/lib/types'
import { cn } from '@/lib/utils'

interface MemberDialogProps {
  member?: FamilyMember
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (member: Omit<FamilyMember, 'id'> & { id?: string }) => void
}

export function MemberDialog({ member, open, onOpenChange, onSave }: MemberDialogProps) {
  const [name, setName] = useState(member?.name || '')
  const [selectedColor, setSelectedColor] = useState(member?.color || AVATAR_COLORS[0])

  const handleSave = () => {
    if (!name.trim()) return
    
    onSave({
      id: member?.id,
      name: name.trim(),
      color: selectedColor,
    })
    
    if (!member) {
      setName('')
      setSelectedColor(AVATAR_COLORS[0])
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{member ? 'Edit' : 'Add'} Family Member</DialogTitle>
          <DialogDescription>
            {member ? 'Update' : 'Create a new'} family member profile.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Avatar Color</Label>
            <div className="grid grid-cols-8 gap-2">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={cn(
                    'h-10 w-10 rounded-full transition-all duration-200',
                    'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    selectedColor === color && 'ring-2 ring-ring ring-offset-2 scale-110'
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {member ? 'Update' : 'Add'} Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
