import { useState } from 'react'
import { FamilyMember, Chore, Event } from '@/lib/types'
import { MemberAvatar } from './MemberAvatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getNextDueDate, isChoreComplete, isChoreOverdue } from '@/lib/helpers'
import { cn } from '@/lib/utils'
import { Plus, SoccerBall, GraduationCap, FirstAid, Users as UsersIcon, CalendarDot, Funnel, CaretLeft, CaretRight } from '@phosphor-icons/react'

interface ScheduleViewProps {
  members: FamilyMember[]
  chores: Chore[]
  events: Event[]
  onAddEvent: () => void
  onEditEvent: (event: Event) => void
  onDeleteEvent: (eventId: string) => void
}

export function ScheduleView({ members, chores, events, onAddEvent, onEditEvent, onDeleteEvent }: ScheduleViewProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string>('all')
  const [weekOffset, setWeekOffset] = useState(0)

  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7))
  
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    return date
  })

  const endOfWeek = new Date(days[days.length - 1])

  const goToPreviousWeek = () => setWeekOffset((prev) => prev - 1)
  const goToNextWeek = () => setWeekOffset((prev) => prev + 1)
  const goToCurrentWeek = () => setWeekOffset(0)

  const formatDateRange = () => {
    const start = days[0]
    const end = days[days.length - 1]
    
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' })
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' })
    const startDay = start.getDate()
    const endDay = end.getDate()
    const year = end.getFullYear()
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`
    }
  }

  const getChoresForDay = (date: Date) => {
    return chores.filter((chore) => {
      const dueDate = getNextDueDate(chore)
      const matchesDate = dueDate.toDateString() === date.toDateString()
      const matchesMember = selectedMemberId === 'all' || chore.assignedTo === selectedMemberId
      return matchesDate && matchesMember
    })
  }

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      const matchesDate = eventDate.toDateString() === date.toDateString()
      const matchesMember = selectedMemberId === 'all' || !event.assignedTo || event.assignedTo === selectedMemberId
      return matchesDate && matchesMember
    })
  }

  const isToday = (date: Date) => {
    const actualToday = new Date()
    return date.toDateString() === actualToday.toDateString()
  }

  const getCategoryIcon = (category: Event['category']) => {
    switch (category) {
      case 'sports':
        return <SoccerBall className="h-3 w-3" />
      case 'school':
        return <GraduationCap className="h-3 w-3" />
      case 'medical':
        return <FirstAid className="h-3 w-3" />
      case 'social':
        return <UsersIcon className="h-3 w-3" />
      default:
        return <CalendarDot className="h-3 w-3" />
    }
  }

  const getCategoryColor = (category: Event['category']) => {
    switch (category) {
      case 'sports':
        return 'border-[oklch(0.68_0.18_145)] bg-[oklch(0.68_0.18_145)]/10'
      case 'school':
        return 'border-primary bg-primary/10'
      case 'medical':
        return 'border-destructive bg-destructive/10'
      case 'social':
        return 'border-secondary bg-secondary/10'
      default:
        return 'border-muted-foreground bg-muted'
    }
  }

  if (members.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h3 className="font-heading text-2xl font-semibold">No Schedule Yet</h3>
          <p className="text-muted-foreground max-w-md">
            Add family members and chores to see your weekly schedule.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-tight">Weekly Schedule</h2>
          <p className="text-muted-foreground mt-1">
            Chores, events, and activities for the week
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Funnel className="h-4 w-4" />
                <SelectValue placeholder="Filter by member" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              {members.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: member.color }}
                    />
                    {member.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={onAddEvent} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousWeek}
              className="h-9 w-9"
            >
              <CaretLeft className="h-4 w-4" />
            </Button>
            <div className="text-center min-w-[220px]">
              <div className="font-heading font-semibold text-lg">
                {formatDateRange()}
              </div>
              {weekOffset !== 0 && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={goToCurrentWeek}
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                >
                  Return to current week
                </Button>
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextWeek}
              className="h-9 w-9"
            >
              <CaretRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {members.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Family Members:</span>
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-2">
                <div 
                  className="h-4 w-4 rounded-sm border-2" 
                  style={{ borderColor: member.color, backgroundColor: `${member.color}20` }}
                />
                <span className="text-sm font-medium">{member.name}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-7">
        {days.map((date, index) => {
          const dayChores = getChoresForDay(date)
          const dayEvents = getEventsForDay(date)
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
          const dayNumber = date.getDate()
          const hasItems = dayChores.length > 0 || dayEvents.length > 0

          return (
            <Card
              key={index}
              className={cn(
                'p-4',
                isToday(date) && 'ring-2 ring-primary bg-primary/5'
              )}
            >
              <div className="space-y-3">
                <div className="text-center">
                  <div className={cn(
                    'text-sm font-semibold',
                    isToday(date) ? 'text-primary' : 'text-muted-foreground'
                  )}>
                    {dayName}
                  </div>
                  <div className={cn(
                    'text-2xl font-heading font-bold',
                    isToday(date) && 'text-primary'
                  )}>
                    {dayNumber}
                  </div>
                </div>

                <div className="space-y-2">
                  {!hasItems && (
                    <p className="text-xs text-center text-muted-foreground">
                      Nothing scheduled
                    </p>
                  )}
                  
                  {dayEvents.map((event) => {
                    const member = event.assignedTo 
                      ? members.find((m) => m.id === event.assignedTo)
                      : undefined

                    return (
                      <div
                        key={event.id}
                        className={cn(
                          'p-2 rounded-lg border-2 space-y-2 cursor-pointer hover:shadow-sm transition-shadow',
                          getCategoryColor(event.category)
                        )}
                        style={member ? {
                          borderLeftColor: member.color,
                          borderLeftWidth: '4px',
                        } : undefined}
                        onClick={() => onEditEvent(event)}
                      >
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5">
                            {getCategoryIcon(event.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{event.title}</p>
                            {event.time && !event.allDay && (
                              <p className="text-xs text-muted-foreground">
                                {event.time}
                              </p>
                            )}
                          </div>
                        </div>
                        {member && (
                          <div className="flex justify-center">
                            <MemberAvatar
                              name={member.name}
                              color={member.color}
                              size="sm"
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                  
                  {dayChores.map((chore) => {
                    const member = members.find((m) => m.id === chore.assignedTo)
                    const complete = isChoreComplete(chore)
                    const overdue = isChoreOverdue(chore)

                    return (
                      <div
                        key={chore.id}
                        className={cn(
                          'p-2 rounded-lg border-2 space-y-2',
                          complete && 'bg-[oklch(0.95_0.05_290)] border-[oklch(0.75_0.09_290)]',
                          overdue && !complete && 'border-accent bg-accent/10',
                          !complete && !overdue && 'border-border bg-card'
                        )}
                        style={member && !complete ? {
                          borderLeftColor: member.color,
                          borderLeftWidth: '4px',
                        } : undefined}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <p className={cn(
                            'text-xs font-medium flex-1',
                            complete && 'line-through text-muted-foreground'
                          )}>
                            {chore.title}
                          </p>
                        </div>
                        {member && (
                          <div className="flex justify-center">
                            <MemberAvatar
                              name={member.name}
                              color={member.color}
                              size="sm"
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
