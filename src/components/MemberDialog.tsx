import { useState, useRef, useEffect } from 'react'
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
import { Upload, X } from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/helpers'

interface MemberDialogProps {
  member?: FamilyMember
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (member: Omit<FamilyMember, 'id'> & { id?: string }) => void
}

export function MemberDialog({ member, open, onOpenChange, onSave }: MemberDialogProps) {
  const [name, setName] = useState(member?.name || '')
  const [selectedColor, setSelectedColor] = useState(member?.color || AVATAR_COLORS[0])
  const [avatarUrl, setAvatarUrl] = useState(member?.avatarUrl || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setName(member?.name || '')
      setSelectedColor(member?.color || AVATAR_COLORS[0])
      setAvatarUrl(member?.avatarUrl || '')
    }
  }, [open, member])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    setAvatarUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSave = () => {
    if (!name.trim()) return
    
    onSave({
      id: member?.id,
      name: name.trim(),
      color: selectedColor,
      avatarUrl: avatarUrl || undefined,
    })
    
    if (!member) {
      setName('')
      setSelectedColor(AVATAR_COLORS[0])
      setAvatarUrl('')
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

          <div className="space-y-3">
            <Label>Avatar Image</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={name || 'Avatar'} />}
                <AvatarFallback 
                  style={{ backgroundColor: selectedColor }}
                  className="text-white font-semibold text-2xl"
                >
                  {name ? getInitials(name) : '?'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="avatar-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-fit"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
                {avatarUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    className="w-fit text-destructive hover:text-destructive"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remove Image
                  </Button>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Upload a custom avatar image or use the color-based avatar below
            </p>
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
            <p className="text-xs text-muted-foreground">
              Color is used as fallback when no image is uploaded
            </p>
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
