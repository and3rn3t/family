import { useState, useEffect, useRef } from 'react'
import { useKV, useStorageState } from '@/hooks/use-persisted-storage'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { ChartBar, Calendar, Users, Trophy, ArrowCounterClockwise } from '@phosphor-icons/react'
import { FamilyMember, Chore, MonthlyCompetition, WeeklyCompetition, Achievement, Event } from '@/lib/types'
import { ErrorBoundary, SectionErrorBoundary } from '@/components/ErrorBoundary'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SoundToggle } from '@/components/SoundToggle'
import { ThemeSelector } from '@/components/ThemeSelector'
import { WelcomeWizard } from '@/components/WelcomeWizard'
import { playCelebrationSound, playAchievementSound, playUndoSound } from '@/lib/sounds'
import { applyTheme } from '@/lib/themes'
import { 
  getStarsForChore, 
  getCurrentMonthKey, 
  getCurrentWeekKey,
  getMemberMonthlyStars,
  getMemberWeeklyStars,
  finalizeMonthlyCompetition,
  finalizeWeeklyCompetition,
  getExpandedEvents,
  calculateNewStreak,
  getStreakBonus,
  getTodayDateKey,
  shouldRotateChore,
  rotateChore,
  isMysteryBonusDay,
  getMysteryBonusMultiplier,
} from '@/lib/helpers'
import { checkNewAchievements } from '@/lib/achievements'
import { DashboardView } from '@/components/DashboardView'
import { ScheduleView } from '@/components/ScheduleView'
import { ManagementView } from '@/components/ManagementView'
import { CompetitionView } from '@/components/CompetitionView'
import { MemberDialog } from '@/components/MemberDialog'
import { ChoreDialog } from '@/components/ChoreDialog'
import { EventDialog } from '@/components/EventDialog'
import { MemberAchievementsDialog } from '@/components/MemberAchievementsDialog'
import { ChoreWheelDialog } from '@/components/ChoreWheelDialog'
import { DataBackupDialog } from '@/components/DataBackupDialog'
import { ViewModeToggle, ViewOnlyBanner } from '@/components/ViewModeToggle'
import { StorageWarning } from '@/components/StorageWarning'
import { StorageStatus } from '@/components/StorageStatus'
import { Celebration } from '@/components/Celebration'
import { AchievementUnlock } from '@/components/AchievementUnlock'
import { BackupData } from '@/lib/data-backup'

function App() {
  const [members, setMembers] = useKV<FamilyMember[]>('family-members', [])
  const [chores, setChores] = useKV<Chore[]>('chores', [])
  const [events, setEvents] = useKV<Event[]>('events', [])
  const [competitions, setCompetitions] = useKV<MonthlyCompetition[]>('monthly-competitions', [])
  const [weeklyCompetitions, setWeeklyCompetitions] = useKV<WeeklyCompetition[]>('weekly-competitions', [])
  const [lastMonthCheck, setLastMonthCheck] = useKV<string>('last-month-check', '')
  const [lastWeekCheck, setLastWeekCheck] = useKV<string>('last-week-check', '')
  const [isDarkMode, setIsDarkMode] = useKV<boolean>('dark-mode', false)
  const [soundEnabled, setSoundEnabled] = useKV<boolean>('sound-enabled', true)
  const [colorTheme, setColorTheme] = useKV<string>('color-theme', 'default')
  const [wizardCompleted, setWizardCompleted] = useKV<boolean>('wizard-completed', false)
  
  // Store for undo functionality
  const undoDataRef = useRef<{
    chore: Chore
    member: FamilyMember
    starsEarned: number
    monthKey: string
    weekKey: string
  } | null>(null)
  
  const [memberDialogOpen, setMemberDialogOpen] = useState(false)
  const [choreDialogOpen, setChoreDialogOpen] = useState(false)
  const [eventDialogOpen, setEventDialogOpen] = useState(false)
  const [achievementsDialogOpen, setAchievementsDialogOpen] = useState(false)
  const [wheelDialogOpen, setWheelDialogOpen] = useState(false)
  const [backupDialogOpen, setBackupDialogOpen] = useState(false)
  const [isViewOnly, setIsViewOnly] = useKV<boolean>('view-only-mode', false)
  const [viewOnlyPin, setViewOnlyPin] = useKV<string>('view-only-pin', '')
  const [editingMember, setEditingMember] = useState<FamilyMember | undefined>()
  const [viewingMemberAchievements, setViewingMemberAchievements] = useState<FamilyMember | null>(null)
  const [editingChore, setEditingChore] = useState<Chore | undefined>()
  const [editingEvent, setEditingEvent] = useState<Event | undefined>()
  const [showCelebration, setShowCelebration] = useState(false)
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null)

  const safeMembers = members || []
  const safeChores = chores || []
  const safeEvents = events || []
  const safeCompetitions = competitions || []
  const safeWeeklyCompetitions = weeklyCompetitions || []

  const expandedEvents = getExpandedEvents(safeEvents)
  
  // Show wizard on first run (no members and wizard not completed)
  const showWizard = !wizardCompleted && safeMembers.length === 0

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Apply color theme
  useEffect(() => {
    applyTheme(colorTheme || 'default', isDarkMode || false)
  }, [colorTheme, isDarkMode])

  // Check for chore rotations on load
  useEffect(() => {
    const choresToRotate = safeChores.filter(shouldRotateChore)
    if (choresToRotate.length > 0) {
      setChores((current) =>
        (current || []).map((chore) => {
          if (shouldRotateChore(chore)) {
            const rotatedChore = rotateChore(chore)
            const newMember = safeMembers.find((m) => m.id === rotatedChore.assignedTo)
            if (newMember) {
              toast.info(`🔄 ${chore.title} rotated to ${newMember.name}`)
            }
            return rotatedChore
          }
          return chore
        })
      )
    }
  }, []) // Run once on mount

  const handleToggleTheme = () => {
    setIsDarkMode((current) => !current)
  }

  const handleToggleSound = () => {
    setSoundEnabled((current) => !current)
  }

  const handleChangeTheme = (themeId: string) => {
    setColorTheme(themeId)
  }

  const handleWizardComplete = (newMembers: FamilyMember[], newChores: Chore[]) => {
    // Add all members
    setMembers(newMembers)
    
    // Add all chores
    setChores(newChores)
    
    // Mark wizard as completed
    setWizardCompleted(true)
    
    toast.success(`Welcome to Family Organizer! 🎉`, {
      description: `${newMembers.length} member${newMembers.length !== 1 ? 's' : ''} and ${newChores.length} chore${newChores.length !== 1 ? 's' : ''} added.`,
    })
  }

  const handleWizardSkip = () => {
    setWizardCompleted(true)
    toast.info('Setup skipped. You can add family members from the Manage tab.')
  }

  useEffect(() => {
    const currentMonthKey = getCurrentMonthKey()
    
    if (lastMonthCheck && lastMonthCheck !== currentMonthKey) {
      const competition = finalizeMonthlyCompetition(safeMembers, lastMonthCheck)
      
      setCompetitions((current) => [...(current || []), competition])
      
      if (competition.winner) {
        const winner = safeMembers.find((m) => m.id === competition.winner)
        if (winner) {
          toast.success(`🏆 ${winner.name} won last month's competition!`, {
            description: `Congratulations on earning the most stars!`,
            duration: 5000,
          })
        }
      }
    }
    
    if (lastMonthCheck !== currentMonthKey) {
      setLastMonthCheck(currentMonthKey)
    }
  }, [lastMonthCheck, safeMembers, setCompetitions, setLastMonthCheck])

  useEffect(() => {
    const currentWeekKey = getCurrentWeekKey()
    
    if (lastWeekCheck && lastWeekCheck !== currentWeekKey) {
      const competition = finalizeWeeklyCompetition(safeMembers, lastWeekCheck)
      
      setWeeklyCompetitions((current) => [...(current || []), competition])
      
      if (competition.winner) {
        const winner = safeMembers.find((m) => m.id === competition.winner)
        if (winner) {
          toast.success(`⭐ ${winner.name} won last week's mini-competition!`, {
            description: `Great work this week!`,
            duration: 5000,
          })
        }
      }
    }
    
    if (lastWeekCheck !== currentWeekKey) {
      setLastWeekCheck(currentWeekKey)
    }
  }, [lastWeekCheck, safeMembers, setWeeklyCompetitions, setLastWeekCheck])

  const handleSaveMember = (memberData: Omit<FamilyMember, 'id'> & { id?: string }) => {
    if (memberData.id) {
      setMembers((current) =>
        (current || []).map((m) => (m.id === memberData.id ? { ...m, ...memberData } : m))
      )
      toast.success('Family member updated!')
    } else {
      const newMember: FamilyMember = {
        id: `member-${Date.now()}`,
        name: memberData.name,
        color: memberData.color,
        avatarUrl: memberData.avatarUrl,
        avatarIcon: memberData.avatarIcon,
        stars: 0,
        achievements: [],
        monthlyStars: {},
      }
      setMembers((current) => [...(current || []), newMember])
      toast.success(`${memberData.name} added to the family!`)
    }
    setEditingMember(undefined)
  }

  const handleDeleteMember = (memberId: string) => {
    const member = safeMembers.find((m) => m.id === memberId)
    setMembers((current) => (current || []).filter((m) => m.id !== memberId))
    setChores((current) => (current || []).filter((c) => c.assignedTo !== memberId))
    toast.success(`${member?.name} removed from the family`)
  }

  const handleSaveChore = (
    choreData: Omit<Chore, 'id' | 'createdAt'> & { id?: string }
  ) => {
    if (choreData.id) {
      setChores((current) =>
        (current || []).map((c) =>
          c.id === choreData.id
            ? { ...c, ...choreData }
            : c
        )
      )
      toast.success('Chore updated!')
    } else {
      const newChore: Chore = {
        id: `chore-${Date.now()}`,
        title: choreData.title,
        description: choreData.description,
        frequency: choreData.frequency,
        assignedTo: choreData.assignedTo,
        createdAt: Date.now(),
        lastCompleted: choreData.lastCompleted,
      }
      setChores((current) => [...(current || []), newChore])
      toast.success('Chore added!')
    }
    setEditingChore(undefined)
  }

  const handleSaveEvent = (
    eventData: Omit<Event, 'id' | 'createdAt'> & { id?: string }
  ) => {
    if (eventData.id) {
      const existingEvent = safeEvents.find(e => e.id === eventData.id)
      const isRecurringInstance = existingEvent?.parentEventId
      
      if (isRecurringInstance) {
        const newEvent: Event = {
          id: `event-${Date.now()}`,
          title: eventData.title,
          description: eventData.description,
          category: eventData.category,
          date: eventData.date,
          time: eventData.time,
          assignedTo: eventData.assignedTo,
          allDay: eventData.allDay,
          recurrence: eventData.recurrence,
          recurrenceEndDate: eventData.recurrenceEndDate,
          recurringDays: eventData.recurringDays,
          createdAt: Date.now(),
        }
        setEvents((current) => [...(current || []), newEvent])
        toast.success('Created new event from recurring instance!')
      } else {
        setEvents((current) =>
          (current || []).map((e) =>
            e.id === eventData.id
              ? { ...e, ...eventData }
              : e
          )
        )
        toast.success('Event updated!')
      }
    } else {
      const newEvent: Event = {
        id: `event-${Date.now()}`,
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        date: eventData.date,
        time: eventData.time,
        assignedTo: eventData.assignedTo,
        allDay: eventData.allDay,
        recurrence: eventData.recurrence,
        recurrenceEndDate: eventData.recurrenceEndDate,
        recurringDays: eventData.recurringDays,
        createdAt: Date.now(),
      }
      setEvents((current) => [...(current || []), newEvent])
      toast.success('Event added!')
    }
    setEditingEvent(undefined)
  }

  const handleUndoCompletion = () => {
    const undoData = undoDataRef.current
    if (!undoData) return

    // Restore chore to previous state
    setChores((current) =>
      (current || []).map((c) =>
        c.id === undoData.chore.id
          ? { ...c, lastCompleted: undoData.chore.lastCompleted }
          : c
      )
    )

    // Restore member stars
    setMembers((current) =>
      (current || []).map((m) => {
        if (m.id === undoData.member.id) {
          return {
            ...m,
            stars: undoData.member.stars,
            monthlyStars: undoData.member.monthlyStars,
            weeklyStars: undoData.member.weeklyStars,
          }
        }
        return m
      })
    )

    undoDataRef.current = null
    
    if (soundEnabled) {
      playUndoSound()
    }
    
    toast.success('Chore completion undone', {
      description: `${undoData.starsEarned} stars removed`,
    })
  }

  const handleCompleteChore = (choreId: string) => {
    const chore = safeChores.find((c) => c.id === choreId)
    if (!chore) return

    const member = safeMembers.find((m) => m.id === chore.assignedTo)
    if (!member) return

    const baseStars = getStarsForChore(chore.frequency, chore.difficulty)
    const currentMonthKey = getCurrentMonthKey()
    const currentWeekKey = getCurrentWeekKey()
    const todayKey = getTodayDateKey()
    
    // Calculate streak
    const { currentStreak, bestStreak } = calculateNewStreak(member)
    const streakBonus = getStreakBonus(currentStreak)
    
    // Apply mystery bonus multiplier (2x on mystery days)
    const mysteryMultiplier = getMysteryBonusMultiplier()
    const totalStarsEarned = (baseStars + streakBonus) * mysteryMultiplier
    const isMysteryDay = mysteryMultiplier > 1
    
    // Store undo data before making changes
    undoDataRef.current = {
      chore: { ...chore },
      member: { ...member },
      starsEarned: totalStarsEarned,
      monthKey: currentMonthKey,
      weekKey: currentWeekKey,
    }
    
    setChores((current) =>
      (current || []).map((c) =>
        c.id === choreId
          ? { ...c, lastCompleted: Date.now() }
          : c
      )
    )

    setMembers((current) =>
      (current || []).map((m) => {
        if (m.id === chore.assignedTo) {
          const newTotalStars = (m.stars || 0) + totalStarsEarned
          const currentMonthStars = getMemberMonthlyStars(m, currentMonthKey) + totalStarsEarned
          const currentWeekStars = getMemberWeeklyStars(m, currentWeekKey) + totalStarsEarned
          const updatedMember: FamilyMember = {
            ...m,
            stars: newTotalStars,
            monthlyStars: {
              ...(m.monthlyStars || {}),
              [currentMonthKey]: currentMonthStars,
            },
            weeklyStars: {
              ...(m.weeklyStars || {}),
              [currentWeekKey]: currentWeekStars,
            },
            currentStreak,
            bestStreak,
            lastCompletionDate: todayKey,
            mysteryBonusCompletions: isMysteryDay 
              ? (m.mysteryBonusCompletions || 0) + 1 
              : (m.mysteryBonusCompletions || 0),
          }

          const newAchievements = checkNewAchievements(updatedMember, safeChores, safeCompetitions)
          
          if (newAchievements.length > 0) {
            updatedMember.achievements = [...(m.achievements || []), ...newAchievements.map(a => a.id)]
            
            setTimeout(() => {
              setUnlockedAchievement(newAchievements[0])
              if (soundEnabled) {
                playAchievementSound()
              }
            }, 1200)

            if (newAchievements.length > 1) {
              toast.success(`🎉 Unlocked ${newAchievements.length} achievements!`)
            }
          }

          return updatedMember
        }
        return m
      })
    )

    // Play celebration sound
    if (soundEnabled) {
      playCelebrationSound()
    }

    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 1000)
    
    // Build toast message with streak and mystery bonus info
    let description = 'Great job! Keep up the amazing work!'
    if (isMysteryDay) {
      description = `✨ Mystery Bonus Day! Double stars!`
      if (streakBonus > 0) {
        description = `✨ 2x Mystery Bonus + 🔥 ${currentStreak}-day streak!`
      }
    } else if (streakBonus > 0) {
      description = `🔥 ${currentStreak}-day streak! +${streakBonus} bonus stars!`
    } else if (currentStreak > 1) {
      description = `🔥 ${currentStreak}-day streak! Keep it going!`
    }
    
    // Show toast with undo action
    const toastTitle = isMysteryDay 
      ? `✨ Chore completed! +${totalStarsEarned} ⭐ (2x bonus!)`
      : `Chore completed! +${totalStarsEarned} ⭐`
    
    toast.success(toastTitle, {
      description,
      duration: 10000, // 10 second window for undo
      action: {
        label: (
          <span className="flex items-center gap-1">
            <ArrowCounterClockwise className="h-3 w-3" />
            Undo
          </span>
        ),
        onClick: handleUndoCompletion,
      },
    })
    
    // Clear undo data after 30 seconds
    setTimeout(() => {
      undoDataRef.current = null
    }, 30000)
  }

  const handleDeleteChore = (choreId: string) => {
    const chore = safeChores.find((c) => c.id === choreId)
    setChores((current) => (current || []).filter((c) => c.id !== choreId))
    toast.success(`${chore?.title} deleted`)
  }

  const handleDeleteEvent = (eventId: string) => {
    const event = expandedEvents.find((e) => e.id === eventId)
    const isRecurringInstance = event?.parentEventId
    
    if (isRecurringInstance) {
      toast.error('Cannot delete recurring event instances. Edit the original event instead.')
      return
    }
    
    setEvents((current) => (current || []).filter((e) => e.id !== eventId))
    toast.success(`${event?.title} deleted`)
  }

  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member)
    setMemberDialogOpen(true)
  }

  const handleEditChore = (chore: Chore) => {
    setEditingChore(chore)
    setChoreDialogOpen(true)
  }

  const handleEditEvent = (event: Event) => {
    const isRecurringInstance = event.parentEventId
    
    if (isRecurringInstance) {
      const parentEvent = safeEvents.find(e => e.id === event.parentEventId)
      if (parentEvent) {
        setEditingEvent(parentEvent)
      } else {
        setEditingEvent(event)
      }
    } else {
      setEditingEvent(event)
    }
    
    setEventDialogOpen(true)
  }

  const handleAddMember = () => {
    setEditingMember(undefined)
    setMemberDialogOpen(true)
  }

  const handleAddChore = () => {
    setEditingChore(undefined)
    setChoreDialogOpen(true)
  }

  const handleOpenWheel = () => {
    setWheelDialogOpen(true)
  }

  const handleOpenBackup = () => {
    setBackupDialogOpen(true)
  }

  const handleImportData = (data: BackupData['data']) => {
    // Replace all data with imported data
    setMembers(data.members)
    setChores(data.chores)
    setEvents(data.events)
    setCompetitions(data.monthlyCompetitions)
    setWeeklyCompetitions(data.weeklyCompetitions)
    
    // Apply settings if present
    if (data.settings?.isDarkMode !== undefined) {
      setIsDarkMode(data.settings.isDarkMode)
    }
    if (data.settings?.soundEnabled !== undefined) {
      setSoundEnabled(data.settings.soundEnabled)
    }
    if (data.settings?.theme) {
      setCurrentTheme(data.settings.theme)
    }
  }

  const handleAddEvent = () => {
    setEditingEvent(undefined)
    setEventDialogOpen(true)
  }

  const handleViewAchievements = (member: FamilyMember) => {
    setViewingMemberAchievements(member)
    setAchievementsDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
              Family Organizer
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Manage chores and schedules together
            </p>
          </div>
          <div className="flex items-center gap-1">
            <StorageStatus />
            <ViewModeToggle
              isViewOnly={isViewOnly || false}
              onToggle={setIsViewOnly}
              pin={viewOnlyPin || undefined}
            />
            <SoundToggle enabled={soundEnabled ?? true} onToggle={handleToggleSound} />
            <ThemeSelector currentTheme={colorTheme || 'default'} onSelectTheme={handleChangeTheme} />
            <ThemeToggle isDark={isDarkMode || false} onToggle={handleToggleTheme} />
          </div>
        </header>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <ChartBar className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="competition" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Competition</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Manage</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <SectionErrorBoundary section="Dashboard">
              <DashboardView
                members={safeMembers}
                chores={safeChores}
                onCompleteChore={handleCompleteChore}
                onEditChore={handleEditChore}
                onDeleteChore={handleDeleteChore}
                onEditMember={handleEditMember}
                onDeleteMember={handleDeleteMember}
                onAddChore={handleAddChore}
                onSpinWheel={handleOpenWheel}
                onViewAchievements={handleViewAchievements}
                isViewOnly={isViewOnly || false}
              />
            </SectionErrorBoundary>
          </TabsContent>

          <TabsContent value="competition" className="space-y-6">
            <SectionErrorBoundary section="Competition">
              <CompetitionView 
                members={safeMembers} 
                competitions={safeCompetitions}
                weeklyCompetitions={safeWeeklyCompetitions}
              />
            </SectionErrorBoundary>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <SectionErrorBoundary section="Schedule">
              <ScheduleView 
                members={safeMembers} 
                chores={safeChores}
                events={expandedEvents}
                onAddEvent={handleAddEvent}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
                isViewOnly={isViewOnly || false}
              />
            </SectionErrorBoundary>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <SectionErrorBoundary section="Management">
              <ManagementView
                members={safeMembers}
                chores={safeChores}
                onAddMember={handleAddMember}
                onEditMember={handleEditMember}
                onDeleteMember={handleDeleteMember}
                onOpenBackup={handleOpenBackup}
                isViewOnly={isViewOnly || false}
                onSetPin={setViewOnlyPin}
                currentPin={viewOnlyPin || ''}
              />
            </SectionErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>

      <MemberDialog
        member={editingMember}
        open={memberDialogOpen}
        onOpenChange={(open) => {
          setMemberDialogOpen(open)
          if (!open) setEditingMember(undefined)
        }}
        onSave={handleSaveMember}
      />

      <ChoreDialog
        chore={editingChore}
        members={safeMembers}
        open={choreDialogOpen}
        onOpenChange={(open) => {
          setChoreDialogOpen(open)
          if (!open) setEditingChore(undefined)
        }}
        onSave={handleSaveChore}
      />

      <ChoreWheelDialog
        open={wheelDialogOpen}
        onOpenChange={setWheelDialogOpen}
        members={safeMembers}
        soundEnabled={soundEnabled}
      />

      <DataBackupDialog
        open={backupDialogOpen}
        onOpenChange={setBackupDialogOpen}
        members={safeMembers}
        chores={safeChores}
        events={safeEvents}
        monthlyCompetitions={safeCompetitions}
        weeklyCompetitions={safeWeeklyCompetitions}
        settings={{
          isDarkMode,
          soundEnabled,
          theme: colorTheme,
        }}
        onImport={handleImportData}
      />

      <EventDialog
        event={editingEvent}
        members={safeMembers}
        open={eventDialogOpen}
        onOpenChange={(open) => {
          setEventDialogOpen(open)
          if (!open) setEditingEvent(undefined)
        }}
        onSave={handleSaveEvent}
      />

      <MemberAchievementsDialog
        member={viewingMemberAchievements}
        open={achievementsDialogOpen}
        onOpenChange={(open) => {
          setAchievementsDialogOpen(open)
          if (!open) setViewingMemberAchievements(null)
        }}
      />

      <Celebration show={showCelebration} />
      <AchievementUnlock 
        achievement={unlockedAchievement} 
        onComplete={() => setUnlockedAchievement(null)} 
      />
      
      <WelcomeWizard
        open={showWizard}
        onComplete={handleWizardComplete}
        onSkip={handleWizardSkip}
      />
      
      <Toaster position="top-center" richColors />
      
      {/* View-only mode indicator */}
      {isViewOnly && <ViewOnlyBanner />}
      
      {/* Storage warning */}
      <StorageWarning />
    </div>
  )
}

export default App