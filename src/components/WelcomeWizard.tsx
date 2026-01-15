import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { FamilyMember, Chore, AVATAR_COLORS } from '@/lib/types'
import { getInitials, getFrequencyLabel, getStarsForChore, getDifficultyEmoji } from '@/lib/helpers'
import { PRESET_AVATAR_ICONS, getIconByName } from '@/lib/avatar-icons'
import { CHORE_TEMPLATES, ChoreTemplate, TEMPLATE_CATEGORIES } from '@/lib/chore-templates'
import {
  House,
  UsersThree,
  Broom,
  Confetti,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Star,
  Trophy,
  Calendar,
  Check,
  Sparkle,
  Upload,
} from '@phosphor-icons/react'

interface WelcomeWizardProps {
  open: boolean
  onComplete: (members: FamilyMember[], chores: Chore[]) => void
  onSkip: () => void
}

type WizardStep = 'welcome' | 'members' | 'chores' | 'complete'

interface NewMember {
  id: string
  name: string
  color: string
  avatarIcon?: string
  avatarUrl?: string
}

interface SelectedChore {
  template: ChoreTemplate
  assignedTo: string
}

export function WelcomeWizard({ open, onComplete, onSkip }: WelcomeWizardProps) {
  const [step, setStep] = useState<WizardStep>('welcome')
  const [members, setMembers] = useState<NewMember[]>([])
  const [selectedChores, setSelectedChores] = useState<SelectedChore[]>([])
  const [choreCategory, setChoreCategory] = useState('all')
  
  // New member form state
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberColor, setNewMemberColor] = useState(AVATAR_COLORS[0])
  const [newMemberIcon, setNewMemberIcon] = useState('')
  const [newMemberUrl, setNewMemberUrl] = useState('')
  const [showAddMember, setShowAddMember] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddMember = () => {
    if (!newMemberName.trim()) return
    
    const newMember: NewMember = {
      id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newMemberName.trim(),
      color: newMemberColor,
      avatarIcon: newMemberIcon || undefined,
      avatarUrl: newMemberUrl || undefined,
    }
    
    setMembers([...members, newMember])
    setNewMemberName('')
    setNewMemberColor(AVATAR_COLORS[(members.length + 1) % AVATAR_COLORS.length])
    setNewMemberIcon('')
    setNewMemberUrl('')
    setShowAddMember(false)
  }

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id))
    // Also remove any chores assigned to this member
    setSelectedChores(selectedChores.filter(c => c.assignedTo !== id))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setNewMemberUrl(reader.result as string)
      setNewMemberIcon('')
    }
    reader.readAsDataURL(file)
  }

  const handleToggleChore = (template: ChoreTemplate, memberId: string) => {
    const existing = selectedChores.find(
      c => c.template.title === template.title && c.assignedTo === memberId
    )
    
    if (existing) {
      setSelectedChores(selectedChores.filter(
        c => !(c.template.title === template.title && c.assignedTo === memberId)
      ))
    } else {
      setSelectedChores([...selectedChores, { template, assignedTo: memberId }])
    }
  }

  const isChoreSelected = (template: ChoreTemplate, memberId: string) => {
    return selectedChores.some(
      c => c.template.title === template.title && c.assignedTo === memberId
    )
  }

  const handleComplete = () => {
    // Convert to proper types
    const familyMembers: FamilyMember[] = members.map(m => ({
      id: m.id,
      name: m.name,
      color: m.color,
      avatarIcon: m.avatarIcon,
      avatarUrl: m.avatarUrl,
      stars: 0,
      achievements: [],
      monthlyStars: {},
      weeklyStars: {},
    }))

    const chores: Chore[] = selectedChores.map((c, index) => ({
      id: `chore-${Date.now()}-${index}`,
      title: c.template.title,
      description: c.template.description,
      frequency: c.template.frequency,
      difficulty: c.template.difficulty || 'medium',
      assignedTo: c.assignedTo,
      createdAt: Date.now(),
    }))

    onComplete(familyMembers, chores)
  }

  const nextStep = () => {
    const steps: WizardStep[] = ['welcome', 'members', 'chores', 'complete']
    const currentIndex = steps.indexOf(step)
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1])
    }
  }

  const prevStep = () => {
    const steps: WizardStep[] = ['welcome', 'members', 'chores', 'complete']
    const currentIndex = steps.indexOf(step)
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1])
    }
  }

  const canProceed = () => {
    switch (step) {
      case 'welcome':
        return true
      case 'members':
        return members.length > 0
      case 'chores':
        return true // Chores are optional
      case 'complete':
        return true
      default:
        return false
    }
  }

  const filteredTemplates = choreCategory === 'all'
    ? CHORE_TEMPLATES
    : CHORE_TEMPLATES.filter(t => t.category === choreCategory)

  const IconComponent = newMemberIcon ? getIconByName(newMemberIcon) : null

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0" hideCloseButton>
        <AnimatePresence mode="wait">
          {/* Welcome Step */}
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8"
            >
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <House className="w-12 h-12 text-primary" weight="duotone" />
                </motion.div>
                
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">Welcome to Family Organizer! 🎉</h2>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    Let's get your family set up in just a few quick steps. 
                    You'll be organizing chores and earning stars in no time!
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="p-4 rounded-lg bg-card border">
                    <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" weight="fill" />
                    <p className="text-sm font-medium">Earn Stars</p>
                    <p className="text-xs text-muted-foreground">Complete chores to collect stars</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card border">
                    <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" weight="fill" />
                    <p className="text-sm font-medium">Compete</p>
                    <p className="text-xs text-muted-foreground">Weekly & monthly competitions</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card border">
                    <Sparkle className="w-8 h-8 text-purple-500 mx-auto mb-2" weight="fill" />
                    <p className="text-sm font-medium">Achievements</p>
                    <p className="text-xs text-muted-foreground">Unlock special badges</p>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button variant="ghost" onClick={onSkip}>
                    Skip Setup
                  </Button>
                  <Button onClick={nextStep} size="lg">
                    Let's Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Members Step */}
          {step === 'members' && (
            <motion.div
              key="members"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-[80vh]"
            >
              <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UsersThree className="w-5 h-5 text-primary" weight="duotone" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Add Your Family Members</h2>
                    <p className="text-sm text-muted-foreground">
                      Who's in your household? Add at least one person to continue.
                    </p>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-6">
                {/* Existing members */}
                {members.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {members.map(member => {
                      const MemberIcon = member.avatarIcon ? getIconByName(member.avatarIcon) : null
                      return (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-card border"
                        >
                          <Avatar className="h-12 w-12">
                            {member.avatarUrl && (
                              <AvatarImage src={member.avatarUrl} alt={member.name} />
                            )}
                            <AvatarFallback
                              style={{ backgroundColor: member.color }}
                              className="text-white font-semibold"
                            >
                              {MemberIcon ? (
                                <MemberIcon size={24} weight="fill" />
                              ) : (
                                getInitials(member.name)
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{member.name}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Add member form */}
                {showAddMember ? (
                  <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        placeholder="Enter name"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        {newMemberUrl && (
                          <AvatarImage src={newMemberUrl} alt={newMemberName || 'Avatar'} />
                        )}
                        <AvatarFallback
                          style={{ backgroundColor: newMemberColor }}
                          className="text-white font-semibold text-xl"
                        >
                          {IconComponent ? (
                            <IconComponent size={32} weight="fill" />
                          ) : (
                            newMemberName ? getInitials(newMemberName) : '?'
                          )}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-2">Pick a color:</p>
                        <div className="flex gap-2 flex-wrap">
                          {AVATAR_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={cn(
                                'h-8 w-8 rounded-full transition-all',
                                'hover:scale-110 focus:outline-none',
                                newMemberColor === color && 'ring-2 ring-ring ring-offset-2 scale-110'
                              )}
                              style={{ backgroundColor: color }}
                              onClick={() => setNewMemberColor(color)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Avatar Icon (optional)</Label>
                      <div className="flex gap-2 flex-wrap max-h-24 overflow-y-auto">
                        {PRESET_AVATAR_ICONS.slice(0, 16).map(({ name: iconName, icon: Icon }) => (
                          <button
                            key={iconName}
                            type="button"
                            className={cn(
                              'h-10 w-10 rounded-lg transition-all flex items-center justify-center',
                              'hover:scale-110 focus:outline-none',
                              newMemberIcon === iconName && 'ring-2 ring-primary scale-110 bg-primary/10'
                            )}
                            style={{ 
                              backgroundColor: newMemberIcon === iconName ? undefined : newMemberColor + '20',
                              color: newMemberColor 
                            }}
                            onClick={() => {
                              setNewMemberIcon(iconName)
                              setNewMemberUrl('')
                            }}
                          >
                            <Icon size={20} weight="fill" />
                          </button>
                        ))}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          className={cn(
                            'h-10 w-10 rounded-lg transition-all flex items-center justify-center',
                            'hover:scale-110 focus:outline-none border-2 border-dashed',
                            'text-muted-foreground hover:text-foreground hover:border-foreground'
                          )}
                          onClick={() => fileInputRef.current?.click()}
                          title="Upload custom image"
                        >
                          <Upload size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleAddMember} disabled={!newMemberName.trim()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Member
                      </Button>
                      {members.length > 0 && (
                        <Button variant="ghost" onClick={() => setShowAddMember(false)}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowAddMember(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Member
                  </Button>
                )}
              </ScrollArea>

              <div className="p-6 border-t flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={nextStep} disabled={!canProceed()}>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Chores Step */}
          {step === 'chores' && (
            <motion.div
              key="chores"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-[80vh]"
            >
              <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Broom className="w-5 h-5 text-primary" weight="duotone" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Add Some Chores</h2>
                    <p className="text-sm text-muted-foreground">
                      Select chores to assign to family members. You can always add more later!
                    </p>
                  </div>
                </div>
                
                {selectedChores.length > 0 && (
                  <Badge variant="secondary" className="mt-3">
                    {selectedChores.length} chore{selectedChores.length !== 1 ? 's' : ''} selected
                  </Badge>
                )}
              </div>

              <div className="flex gap-2 p-4 border-b overflow-x-auto">
                {TEMPLATE_CATEGORIES.map(cat => (
                  <Button
                    key={cat.value}
                    variant={choreCategory === cat.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChoreCategory(cat.value)}
                    className="whitespace-nowrap"
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>

              <ScrollArea className="flex-1 p-6">
                <div className="space-y-2">
                  {filteredTemplates.map(template => (
                    <div
                      key={template.title}
                      className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <p className="font-medium">{template.title}</p>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0">
                          {getDifficultyEmoji(template.difficulty || 'medium')} {getFrequencyLabel(template.frequency)} · {getStarsForChore(template.frequency, template.difficulty)}⭐
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2 flex-wrap">
                        {members.map(member => {
                          const selected = isChoreSelected(template, member.id)
                          const MemberIcon = member.avatarIcon ? getIconByName(member.avatarIcon) : null
                          return (
                            <button
                              key={member.id}
                              onClick={() => handleToggleChore(template, member.id)}
                              className={cn(
                                'flex items-center gap-2 px-2 py-1 rounded-full text-sm transition-all',
                                'border hover:scale-105',
                                selected
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-background border-border hover:border-primary'
                              )}
                            >
                              <Avatar className="h-5 w-5">
                                <AvatarFallback
                                  style={{ backgroundColor: member.color }}
                                  className="text-white text-xs"
                                >
                                  {MemberIcon ? (
                                    <MemberIcon size={12} weight="fill" />
                                  ) : (
                                    getInitials(member.name).charAt(0)
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <span>{member.name}</span>
                              {selected && <Check className="h-3 w-3" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-6 border-t flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={nextStep}>
                  {selectedChores.length > 0 ? 'Continue' : 'Skip for Now'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Complete Step */}
          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8"
            >
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="mx-auto w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center"
                >
                  <Confetti className="w-12 h-12 text-green-500" weight="duotone" />
                </motion.div>
                
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">You're All Set! 🎉</h2>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    Your family organizer is ready to go. Here's what we've set up:
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
                  <div className="p-4 rounded-lg bg-card border text-left">
                    <UsersThree className="w-6 h-6 text-primary mb-2" weight="duotone" />
                    <p className="text-2xl font-bold">{members.length}</p>
                    <p className="text-sm text-muted-foreground">
                      Family member{members.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-card border text-left">
                    <Broom className="w-6 h-6 text-primary mb-2" weight="duotone" />
                    <p className="text-2xl font-bold">{selectedChores.length}</p>
                    <p className="text-sm text-muted-foreground">
                      Chore{selectedChores.length !== 1 ? 's' : ''} assigned
                    </p>
                  </div>
                </div>

                {members.length > 0 && (
                  <div className="flex justify-center gap-2 flex-wrap">
                    {members.map(member => {
                      const MemberIcon = member.avatarIcon ? getIconByName(member.avatarIcon) : null
                      return (
                        <div key={member.id} className="flex flex-col items-center">
                          <Avatar className="h-12 w-12">
                            {member.avatarUrl && (
                              <AvatarImage src={member.avatarUrl} alt={member.name} />
                            )}
                            <AvatarFallback
                              style={{ backgroundColor: member.color }}
                              className="text-white font-semibold"
                            >
                              {MemberIcon ? (
                                <MemberIcon size={24} weight="fill" />
                              ) : (
                                getInitials(member.name)
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs mt-1">{member.name}</span>
                        </div>
                      )
                    })}
                  </div>
                )}

                <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground max-w-md mx-auto">
                  <p className="font-medium text-foreground mb-2">Quick Tips:</p>
                  <ul className="space-y-1 text-left">
                    <li>• Complete chores to earn ⭐ stars</li>
                    <li>• Build streaks for bonus points 🔥</li>
                    <li>• Check the Competition tab for leaderboards</li>
                    <li>• Add more chores anytime from the Dashboard</li>
                  </ul>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={handleComplete} size="lg">
                    Start Organizing!
                    <Confetti className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {(['welcome', 'members', 'chores', 'complete'] as WizardStep[]).map((s, i) => (
            <div
              key={s}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                step === s ? 'w-6 bg-primary' : 'bg-muted-foreground/30'
              )}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
