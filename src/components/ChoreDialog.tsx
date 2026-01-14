import { useState, useEffect } from 'react'
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Chore, ChoreFrequency, FamilyMember, RotationFrequency } from '@/lib/types'
import { getFrequencyLabel, getStarsForChore, getRotationLabel } from '@/lib/helpers'
import { CHORE_TEMPLATES, TEMPLATE_CATEGORIES, ChoreTemplate } from '@/lib/chore-templates'
import { Checkbox } from '@/components/ui/checkbox'
import { Star, CaretDown, Lightning, ArrowsClockwise } from '@phosphor-icons/react'

interface ChoreDialogProps {
  chore?: Chore
  members: FamilyMember[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (chore: Omit<Chore, 'id' | 'createdAt'> & { id?: string }) => void
}

const FREQUENCIES: ChoreFrequency[] = ['daily', 'weekly', 'biweekly', 'monthly']
const ROTATION_OPTIONS: RotationFrequency[] = ['none', 'weekly', 'monthly']

export function ChoreDialog({ chore, members, open, onOpenChange, onSave }: ChoreDialogProps) {
  const [title, setTitle] = useState(chore?.title || '')
  const [description, setDescription] = useState(chore?.description || '')
  const [frequency, setFrequency] = useState<ChoreFrequency>(chore?.frequency || 'weekly')
  const [assignedTo, setAssignedTo] = useState(chore?.assignedTo || (members[0]?.id || ''))
  const [showTemplates, setShowTemplates] = useState(false)
  const [templateCategory, setTemplateCategory] = useState('all')
  const [rotation, setRotation] = useState<RotationFrequency>(chore?.rotation || 'none')
  const [rotationMembers, setRotationMembers] = useState<string[]>(chore?.rotationMembers || [])

  // Reset form when dialog opens/closes or chore changes
  useEffect(() => {
    if (open) {
      setTitle(chore?.title || '')
      setDescription(chore?.description || '')
      setFrequency(chore?.frequency || 'weekly')
      setAssignedTo(chore?.assignedTo || (members[0]?.id || ''))
      setShowTemplates(false)
      setRotation(chore?.rotation || 'none')
      setRotationMembers(chore?.rotationMembers || [])
    }
  }, [open, chore, members])

  const toggleRotationMember = (memberId: string) => {
    setRotationMembers((current) =>
      current.includes(memberId)
        ? current.filter((id) => id !== memberId)
        : [...current, memberId]
    )
  }

  const filteredTemplates = templateCategory === 'all' 
    ? CHORE_TEMPLATES 
    : CHORE_TEMPLATES.filter((t) => t.category === templateCategory)

  const handleSelectTemplate = (template: ChoreTemplate) => {
    setTitle(template.title)
    setDescription(template.description)
    setFrequency(template.frequency)
    setShowTemplates(false)
  }

  const handleSave = () => {
    if (!title.trim() || !assignedTo) return
    
    onSave({
      id: chore?.id,
      title: title.trim(),
      description: description.trim(),
      frequency,
      assignedTo,
      lastCompleted: chore?.lastCompleted,
      rotation: rotation !== 'none' ? rotation : undefined,
      rotationMembers: rotation !== 'none' && rotationMembers.length > 1 ? rotationMembers : undefined,
      lastRotated: chore?.lastRotated,
    })
    
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{chore ? 'Edit' : 'Add'} Chore</DialogTitle>
          <DialogDescription>
            {chore ? 'Update' : 'Create a new'} household chore.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Quick Templates Section - Only show when adding new chore */}
          {!chore && (
            <Collapsible open={showTemplates} onOpenChange={setShowTemplates}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <Lightning className="h-4 w-4 text-amber-500" weight="fill" />
                    <span>Quick Templates</span>
                  </div>
                  <CaretDown className={`h-4 w-4 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-3">
                <Select value={templateCategory} onValueChange={setTemplateCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                  {filteredTemplates.map((template, idx) => (
                    <button
                      key={`${template.title}-${idx}`}
                      onClick={() => handleSelectTemplate(template)}
                      className="flex items-center justify-between p-2 text-left text-sm rounded-md border hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <span className="font-medium truncate">{template.title}</span>
                      <div className="flex items-center gap-1 text-muted-foreground shrink-0 ml-2">
                        <Star weight="fill" className="h-3 w-3 text-amber-500" />
                        <span className="text-xs">{getStarsForChore(template.frequency)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

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

          {/* Rotation Settings */}
          {members.length > 1 && (
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between" type="button">
                  <div className="flex items-center gap-2">
                    <ArrowsClockwise className="h-4 w-4 text-muted-foreground" />
                    <span>Rotation Settings</span>
                  </div>
                  <CaretDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-3">
                <div className="space-y-2">
                  <Label>Rotation Frequency</Label>
                  <Select value={rotation} onValueChange={(v) => setRotation(v as RotationFrequency)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROTATION_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {getRotationLabel(opt)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {rotation !== 'none' && (
                  <div className="space-y-2">
                    <Label>Rotate Between</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Select 2 or more members to rotate this chore between
                    </p>
                    <div className="space-y-2">
                      {members.map((member) => (
                        <div key={member.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`rotate-${member.id}`}
                            checked={rotationMembers.includes(member.id)}
                            onCheckedChange={() => toggleRotationMember(member.id)}
                          />
                          <label
                            htmlFor={`rotate-${member.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {member.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    {rotationMembers.length < 2 && rotation !== 'none' && (
                      <p className="text-xs text-amber-600">
                        Select at least 2 members for rotation
                      </p>
                    )}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}
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
