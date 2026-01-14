import { useState } from 'react'
import { FamilyMember, Chore, Event } from '@/lib/types'
import { MemberAvatar } from './MemberAvatar'
import { EventCountdown } from './EventCountdown'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getNextDueDate, isChoreComplete, isChoreOverdue } from '@/lib/helpers'
import { cn } from '@/lib/utils'
import { Plus, SoccerBall, GraduationCap, FirstAid, Users as UsersIcon, CalendarDot, Funnel, CaretLeft, CaretRight, Printer, DownloadSimple, Trash, PencilSimple, Clock } from '@phosphor-icons/react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

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
  const [viewMode, setViewMode] = useState<'today' | 'week'>('today')

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

  const handlePrint = () => {
    window.print()
    toast.success('Opening print dialog...')
  }

  const handleExportCSV = () => {
    const csvRows: string[][] = []
    csvRows.push(['Date', 'Day', 'Type', 'Title', 'Time', 'Category', 'Assigned To', 'Status'])

    days.forEach((date) => {
      const dayChores = getChoresForDay(date)
      const dayEvents = getEventsForDay(date)
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
      const dateStr = date.toLocaleDateString('en-US')

      dayEvents.forEach((event) => {
        const member = event.assignedTo 
          ? members.find((m) => m.id === event.assignedTo)?.name || 'Unassigned'
          : 'All'
        csvRows.push([
          dateStr,
          dayName,
          'Event',
          event.title,
          event.allDay ? 'All Day' : (event.time || ''),
          event.category,
          member,
          ''
        ])
      })

      dayChores.forEach((chore) => {
        const member = members.find((m) => m.id === chore.assignedTo)?.name || 'Unassigned'
        const complete = isChoreComplete(chore)
        const overdue = isChoreOverdue(chore)
        const status = complete ? 'Complete' : (overdue ? 'Overdue' : 'Pending')
        
        csvRows.push([
          dateStr,
          dayName,
          'Chore',
          chore.title,
          '',
          chore.frequency,
          member,
          status
        ])
      })
    })

    const csvContent = csvRows.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `schedule_${formatDateRange().replace(/[,\s]/g, '_')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Schedule exported to CSV!')
  }

  const handleExportJSON = () => {
    const scheduleData = {
      dateRange: formatDateRange(),
      startDate: days[0].toISOString(),
      endDate: days[days.length - 1].toISOString(),
      filteredMember: selectedMemberId === 'all' ? 'all' : members.find(m => m.id === selectedMemberId)?.name,
      days: days.map((date) => ({
        date: date.toISOString(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        events: getEventsForDay(date).map((event) => ({
          title: event.title,
          description: event.description,
          category: event.category,
          time: event.time,
          allDay: event.allDay,
          assignedTo: event.assignedTo 
            ? members.find((m) => m.id === event.assignedTo)?.name 
            : null,
          recurrence: event.recurrence
        })),
        chores: getChoresForDay(date).map((chore) => ({
          title: chore.title,
          description: chore.description,
          frequency: chore.frequency,
          assignedTo: members.find((m) => m.id === chore.assignedTo)?.name || 'Unassigned',
          complete: isChoreComplete(chore),
          overdue: isChoreOverdue(chore)
        }))
      }))
    }

    const jsonContent = JSON.stringify(scheduleData, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `schedule_${formatDateRange().replace(/[,\s]/g, '_')}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Schedule exported to JSON!')
  }

  const getTodayChores = () => {
    const todayDate = new Date()
    return chores.filter((chore) => {
      const dueDate = getNextDueDate(chore)
      const matchesDate = dueDate.toDateString() === todayDate.toDateString()
      const matchesMember = selectedMemberId === 'all' || chore.assignedTo === selectedMemberId
      return matchesDate && matchesMember
    })
  }

  const getTodayEvents = () => {
    const todayDate = new Date()
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      const matchesDate = eventDate.toDateString() === todayDate.toDateString()
      const matchesMember = selectedMemberId === 'all' || !event.assignedTo || event.assignedTo === selectedMemberId
      return matchesDate && matchesMember
    }).sort((a, b) => {
      if (a.allDay && !b.allDay) return -1
      if (!a.allDay && b.allDay) return 1
      if (!a.time || !b.time) return 0
      return a.time.localeCompare(b.time)
    })
  }

  const getUpcomingEvents = () => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
    return getTodayEvents().filter(event => {
      if (event.allDay) return true
      if (!event.time) return true
      
      const [hours, minutes] = event.time.split(':').map(Number)
      const eventTime = hours * 60 + minutes
      
      return eventTime >= currentTime
    })
  }

  const isPastEvent = (event: Event) => {
    if (event.allDay || !event.time) return false
    
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const [hours, minutes] = event.time.split(':').map(Number)
    const eventTime = hours * 60 + minutes
    
    return eventTime < currentTime
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
          <h2 className="font-heading text-3xl font-bold tracking-tight">Schedule</h2>
          <p className="text-muted-foreground mt-1">
            Chores, events, and activities
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
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
            <span className="hidden sm:inline">Add Event</span>
          </Button>
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'today' | 'week')}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="today" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Today
          </TabsTrigger>
          <TabsTrigger value="week" className="flex items-center gap-2">
            <CalendarDot className="h-4 w-4" />
            Week
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-2xl font-bold">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>

              {getTodayChores().length === 0 && getTodayEvents().length === 0 && (
                <div className="text-center py-12">
                  <CalendarDot className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-lg font-medium">Nothing scheduled for today</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enjoy your free time!
                  </p>
                </div>
              )}

              {getUpcomingEvents().length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading text-lg font-semibold">Upcoming Events</h4>
                    <Badge variant="secondary">{getUpcomingEvents().length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {getUpcomingEvents().map((event) => {
                      const member = event.assignedTo 
                        ? members.find((m) => m.id === event.assignedTo)
                        : undefined
                      const isRecurringInstance = !!event.parentEventId
                      const isPast = isPastEvent(event)

                      return (
                        <div
                          key={event.id}
                          className={cn(
                            'p-4 rounded-lg border-2 space-y-3 hover:shadow-md transition-all group',
                            getCategoryColor(event.category),
                            isPast && 'opacity-50'
                          )}
                          style={member ? {
                            borderLeftColor: member.color,
                            borderLeftWidth: '6px',
                          } : undefined}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="mt-1">
                                {getCategoryIcon(event.category)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-base">{event.title}</p>
                                {event.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {event.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                  {event.allDay ? (
                                    <Badge variant="outline" className="text-xs">All Day</Badge>
                                  ) : event.time && (
                                    <Badge variant="outline" className="text-xs font-mono">
                                      {event.time}
                                    </Badge>
                                  )}
                                  {isPast && (
                                    <Badge variant="secondary" className="text-xs">
                                      Completed
                                    </Badge>
                                  )}
                                  {!isPast && event.time && (
                                    <EventCountdown eventTime={event.time} allDay={event.allDay} />
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-background/50"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEditEvent(event)
                                }}
                              >
                                <PencilSimple className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:bg-background/50 hover:text-destructive disabled:opacity-50"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDeleteEvent(event.id)
                                }}
                                disabled={isRecurringInstance}
                                title={isRecurringInstance ? 'Cannot delete recurring instance' : 'Delete event'}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {member && (
                            <div className="flex items-center gap-2 pt-2 border-t">
                              <MemberAvatar
                                name={member.name}
                                color={member.color}
                                avatarUrl={member.avatarUrl}
                                avatarIcon={member.avatarIcon}
                                size="sm"
                              />
                              <span className="text-sm font-medium">{member.name}</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {getTodayChores().length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading text-lg font-semibold">Chores Due Today</h4>
                    <Badge variant="secondary">{getTodayChores().length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {getTodayChores().map((chore) => {
                      const member = members.find((m) => m.id === chore.assignedTo)
                      const complete = isChoreComplete(chore)
                      const overdue = isChoreOverdue(chore)

                      return (
                        <div
                          key={chore.id}
                          className={cn(
                            'p-4 rounded-lg border-2 space-y-3',
                            complete && 'bg-[oklch(0.95_0.05_290)] border-[oklch(0.75_0.09_290)]',
                            overdue && !complete && 'border-accent bg-accent/10',
                            !complete && !overdue && 'border-border bg-card hover:shadow-md transition-shadow'
                          )}
                          style={member && !complete ? {
                            borderLeftColor: member.color,
                            borderLeftWidth: '6px',
                          } : undefined}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className={cn(
                                'font-semibold text-base',
                                complete && 'line-through text-muted-foreground'
                              )}>
                                {chore.title}
                              </p>
                              {chore.description && (
                                <p className={cn(
                                  'text-sm text-muted-foreground mt-1',
                                  complete && 'line-through'
                                )}>
                                  {chore.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {chore.frequency}
                                </Badge>
                                {complete && (
                                  <Badge variant="secondary" className="text-xs">
                                    Completed
                                  </Badge>
                                )}
                                {overdue && !complete && (
                                  <Badge variant="destructive" className="text-xs">
                                    Overdue
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          {member && (
                            <div className="flex items-center gap-2 pt-2 border-t">
                              <MemberAvatar
                                name={member.name}
                                color={member.color}
                                avatarUrl={member.avatarUrl}
                                avatarIcon={member.avatarIcon}
                                size="sm"
                              />
                              <span className="text-sm font-medium">{member.name}</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="space-y-6 mt-6">
          <div className="hidden print:block mb-8">
            <h1 className="font-heading text-4xl font-bold text-center mb-2">Family Schedule</h1>
            <p className="text-center text-lg text-muted-foreground">{formatDateRange()}</p>
            {selectedMemberId !== 'all' && (
              <p className="text-center text-muted-foreground">
                Filtered for: {members.find(m => m.id === selectedMemberId)?.name}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 print:hidden">
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <DownloadSimple className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportCSV}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJSON}>
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Card className="p-4 print:hidden">
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
            <Card className="p-4 print:hidden">
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
                        const isRecurringInstance = !!event.parentEventId

                        return (
                          <div
                            key={event.id}
                            className={cn(
                              'p-2 rounded-lg border-2 space-y-2 hover:shadow-sm transition-shadow group relative',
                              getCategoryColor(event.category)
                            )}
                            style={member ? {
                              borderLeftColor: member.color,
                              borderLeftWidth: '4px',
                            } : undefined}
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
                              <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 hover:bg-background/50"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onEditEvent(event)
                                  }}
                                >
                                  <PencilSimple className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 text-destructive hover:bg-background/50 hover:text-destructive disabled:opacity-50"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onDeleteEvent(event.id)
                                  }}
                                  disabled={isRecurringInstance}
                                  title={isRecurringInstance ? 'Cannot delete recurring instance' : 'Delete event'}
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            {member && (
                              <div className="flex justify-center">
                                <MemberAvatar
                                  name={member.name}
                                  color={member.color}
                                  avatarUrl={member.avatarUrl}
                                  avatarIcon={member.avatarIcon}
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
                                  avatarUrl={member.avatarUrl}
                                  avatarIcon={member.avatarIcon}
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
