import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { ChartBar, Calendar, Users, Trophy } from '@phosphor-icons/react'
import { FamilyMember, Chore, MonthlyCompetition, WeeklyCompetition, Achievement } from '@/lib/types'
import { 
  getStarsForChore, 
  getCurrentMonthKey, 
  getCurrentWeekKey,
  getMemberMonthlyStars,
  getMemberWeeklyStars,
  finalizeMonthlyCompetition,
  finalizeWeeklyCompetition 
} from '@/lib/helpers'
import { checkNewAchievements } from '@/lib/achievements'
import { DashboardView } from '@/components/DashboardView'
import { ScheduleView } from '@/components/ScheduleView'
import { ManagementView } from '@/components/ManagementView'
import { CompetitionView } from '@/components/CompetitionView'
import { MemberDialog } from '@/components/MemberDialog'
import { ChoreDialog } from '@/components/ChoreDialog'
import { MemberAchievementsDialog } from '@/components/MemberAchievementsDialog'
import { Celebration } from '@/components/Celebration'
import { AchievementUnlock } from '@/components/AchievementUnlock'

function App() {
  const [members, setMembers] = useKV<FamilyMember[]>('family-members', [])
  const [chores, setChores] = useKV<Chore[]>('chores', [])
  const [competitions, setCompetitions] = useKV<MonthlyCompetition[]>('monthly-competitions', [])
  const [weeklyCompetitions, setWeeklyCompetitions] = useKV<WeeklyCompetition[]>('weekly-competitions', [])
  const [lastMonthCheck, setLastMonthCheck] = useKV<string>('last-month-check', '')
  const [lastWeekCheck, setLastWeekCheck] = useKV<string>('last-week-check', '')
  
  const [memberDialogOpen, setMemberDialogOpen] = useState(false)
  const [choreDialogOpen, setChoreDialogOpen] = useState(false)
  const [achievementsDialogOpen, setAchievementsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<FamilyMember | undefined>()
  const [viewingMemberAchievements, setViewingMemberAchievements] = useState<FamilyMember | null>(null)
  const [editingChore, setEditingChore] = useState<Chore | undefined>()
  const [showCelebration, setShowCelebration] = useState(false)
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null)

  const safeMembers = members || []
  const safeChores = chores || []
  const safeCompetitions = competitions || []
  const safeWeeklyCompetitions = weeklyCompetitions || []

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

  const handleCompleteChore = (choreId: string) => {
    const chore = safeChores.find((c) => c.id === choreId)
    if (!chore) return

    const starsEarned = getStarsForChore(chore.frequency)
    const currentMonthKey = getCurrentMonthKey()
    const currentWeekKey = getCurrentWeekKey()
    
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
          const newTotalStars = (m.stars || 0) + starsEarned
          const currentMonthStars = getMemberMonthlyStars(m, currentMonthKey) + starsEarned
          const currentWeekStars = getMemberWeeklyStars(m, currentWeekKey) + starsEarned
          const updatedMember = {
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
          }

          const newAchievements = checkNewAchievements(updatedMember, safeChores, safeCompetitions)
          
          if (newAchievements.length > 0) {
            updatedMember.achievements = [...(m.achievements || []), ...newAchievements.map(a => a.id)]
            
            setTimeout(() => {
              setUnlockedAchievement(newAchievements[0])
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

    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 1000)
    toast.success(`Chore completed! +${starsEarned} ⭐`, {
      description: `Great job! Keep up the amazing work!`,
    })
  }

  const handleDeleteChore = (choreId: string) => {
    const chore = safeChores.find((c) => c.id === choreId)
    setChores((current) => (current || []).filter((c) => c.id !== choreId))
    toast.success(`${chore?.title} deleted`)
  }

  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member)
    setMemberDialogOpen(true)
  }

  const handleEditChore = (chore: Chore) => {
    setEditingChore(chore)
    setChoreDialogOpen(true)
  }

  const handleAddMember = () => {
    setEditingMember(undefined)
    setMemberDialogOpen(true)
  }

  const handleAddChore = () => {
    setEditingChore(undefined)
    setChoreDialogOpen(true)
  }

  const handleViewAchievements = (member: FamilyMember) => {
    setViewingMemberAchievements(member)
    setAchievementsDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
            Family Organizer
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage chores and schedules together
          </p>
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
            <DashboardView
              members={safeMembers}
              chores={safeChores}
              onCompleteChore={handleCompleteChore}
              onEditChore={handleEditChore}
              onDeleteChore={handleDeleteChore}
              onEditMember={handleEditMember}
              onDeleteMember={handleDeleteMember}
              onAddChore={handleAddChore}
              onViewAchievements={handleViewAchievements}
            />
          </TabsContent>

          <TabsContent value="competition" className="space-y-6">
            <CompetitionView 
              members={safeMembers} 
              competitions={safeCompetitions}
              weeklyCompetitions={safeWeeklyCompetitions}
            />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <ScheduleView members={safeMembers} chores={safeChores} />
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <ManagementView
              members={safeMembers}
              chores={safeChores}
              onAddMember={handleAddMember}
              onEditMember={handleEditMember}
              onDeleteMember={handleDeleteMember}
            />
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
      <Toaster position="top-center" richColors />
    </div>
  )
}

export default App