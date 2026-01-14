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
import { PRESET_AVATAR_ICONS, getIconByName } from '@/lib/avatar-icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'

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
  const [avatarIcon, setAvatarIcon] = useState(member?.avatarIcon || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setName(member?.name || '')
      setSelectedColor(member?.color || AVATAR_COLORS[0])
      setAvatarUrl(member?.avatarUrl || '')
      setAvatarIcon(member?.avatarIcon || '')
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
      setAvatarIcon('')
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    setAvatarUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSelectIcon = (iconName: string) => {
    setAvatarIcon(iconName)
    setAvatarUrl('')
  }

  const handleSave = () => {
    if (!name.trim()) return
    
    onSave({
      id: member?.id,
      name: name.trim(),
      color: selectedColor,
      avatarUrl: avatarUrl || undefined,
      avatarIcon: avatarIcon || undefined,
    })
    
    if (!member) {
      setName('')
      setSelectedColor(AVATAR_COLORS[0])
      setAvatarUrl('')
      setAvatarIcon('')
    }
    onOpenChange(false)
  }

  const IconComponent = avatarIcon ? getIconByName(avatarIcon) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{member ? 'Edit' : 'Add'} Family Member</DialogTitle>
          <DialogDescription>
            {member ? 'Update' : 'Create a new'} family member profile.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4 flex-1 overflow-hidden">
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
            <Label>Avatar</Label>
            <div className="flex items-center gap-4 pb-2">
              <Avatar className="h-20 w-20">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={name || 'Avatar'} />}
                <AvatarFallback 
                  style={{ backgroundColor: selectedColor }}
                  className="text-white font-semibold text-2xl"
                >
                  {IconComponent ? (
                    <IconComponent size={40} weight="fill" />
                  ) : (
                    name ? getInitials(name) : '?'
                  )}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-sm text-muted-foreground">
                Choose an icon from the library below or upload a custom image
              </div>
            </div>

            <Tabs defaultValue="icons" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="icons">Icon Library</TabsTrigger>
                <TabsTrigger value="upload">Custom Upload</TabsTrigger>
              </TabsList>
              
              <TabsContent value="icons" className="space-y-3">
                <ScrollArea className="h-[240px] w-full rounded-md border p-4">
                  <div className="grid grid-cols-8 gap-2">
                    {PRESET_AVATAR_ICONS.map(({ name: iconName, icon: Icon }) => (
                      <button
                        key={iconName}
                        type="button"
                        className={cn(
                          'h-12 w-12 rounded-lg transition-all duration-200 flex items-center justify-center',
                          'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring',
                          avatarIcon === iconName && 'ring-2 ring-primary scale-110 bg-primary/10'
                        )}
                        style={{ 
                          backgroundColor: avatarIcon === iconName ? undefined : selectedColor + '20',
                          color: selectedColor 
                        }}
                        onClick={() => handleSelectIcon(iconName)}
                        aria-label={`Select ${iconName} icon`}
                      >
                        <Icon size={24} weight="fill" />
                      </button>
                    ))}
                  </div>
                </ScrollArea>
                {avatarIcon && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setAvatarIcon('')}
                    className="w-fit text-muted-foreground"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear Icon Selection
                  </Button>
                )}
              </TabsContent>
              
              <TabsContent value="upload" className="space-y-3">
                <div className="flex flex-col gap-3 p-4 border rounded-md">
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
                    Upload Custom Image
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
                      Remove Custom Image
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Upload a custom avatar image (JPG, PNG, etc.)
                  </p>
                </div>
              </TabsContent>
            </Tabs>
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
              Color is used for the avatar background
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
