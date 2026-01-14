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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Chore, ChoreFrequency, FamilyMember } from '@/lib/types'
import { getFrequencyLabel, getStarsForChore } from '@/lib/helpers'
import { Star } from '@phosphor-icons/react'

interface ChoreDialogProps {
  chore?: Chore
  members: FamilyMember[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (chore: Omit<Chore, 'id' | 'createdAt'> & { id?: string }) => void
}

const FREQUENCIES: ChoreFrequency[] = ['daily', 'weekly', 'biweekly', 'monthly']

export function ChoreDialog({ chore, members, open, onOpenChange, onSave }: ChoreDialogProps) {
  const [title, setTitle] = useState(chore?.title || '')
  const [description, setDescription] = useState(chore?.description || '')
  const [frequency, setFrequency] = useState<ChoreFrequency>(chore?.frequency || 'weekly')
  const [assignedTo, setAssignedTo] = useState(chore?.assignedTo || (members[0]?.id || ''))

  const handleSave = () => {
    if (!title.trim() || !assignedTo) return
    
    onSave({
      id: chore?.id,
      title: title.trim(),
      description: description.trim(),
      frequency,
      assignedTo,
      lastCompleted: chore?.lastCompleted,
    })
    
    if (!chore) {
      setTitle('')
      setDescription('')
      setFrequency('weekly')
      setAssignedTo(members[0]?.id || '')
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{chore ? 'Edit' : 'Add'} Chore</DialogTitle>
          <DialogDescription>
            {chore ? 'Update' : 'Create a new'} household chore.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Take out trash"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any details or instructions..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={frequency} onValueChange={(v) => setFrequency(v as ChoreFrequency)}>
              <SelectTrigger id="frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCIES.map((freq) => (
                  <SelectItem key={freq} value={freq}>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span>{getFrequencyLabel(freq)}</span>
                      <div className="flex items-center gap-1 text-secondary">
                        <Star weight="fill" className="h-3 w-3" />
                        <span className="text-xs font-semibold">{getStarsForChore(freq)}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Earn <Star weight="fill" className="inline h-3 w-3 text-secondary" /> {getStarsForChore(frequency)} stars when completed
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assigned">Assign To</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger id="assigned">
                <SelectValue placeholder="Select family member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || !assignedTo}>
            {chore ? 'Update' : 'Add'} Chore
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
