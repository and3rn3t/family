import { Event, FamilyMember } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MemberAvatar } from './MemberAvatar'
import { Trash, PencilSimple, SoccerBall, GraduationCap, FirstAid, Users as UsersIcon, CalendarDot, ArrowsClockwise } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface EventCardProps {
  event: Event
  member?: FamilyMember
  onEdit: (event: Event) => void
  onDelete: (eventId: string) => void
  compact?: boolean
}

export function EventCard({ event, member, onEdit, onDelete, compact = false }: EventCardProps) {
  const getCategoryIcon = () => {
    switch (event.category) {
      case 'sports':
        return <SoccerBall className="h-4 w-4" />
      case 'school':
        return <GraduationCap className="h-4 w-4" />
      case 'medical':
        return <FirstAid className="h-4 w-4" />
      case 'social':
        return <UsersIcon className="h-4 w-4" />
      default:
        return <CalendarDot className="h-4 w-4" />
    }
  }

  const getCategoryColor = () => {
    switch (event.category) {
      case 'sports':
        return 'bg-[oklch(0.68_0.18_145)] text-white'
      case 'school':
        return 'bg-primary text-primary-foreground'
      case 'medical':
        return 'bg-destructive text-destructive-foreground'
      case 'social':
        return 'bg-secondary text-secondary-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getCategoryLabel = () => {
    const labels = {
      sports: 'Sports',
      school: 'School',
      medical: 'Medical',
      social: 'Social',
      other: 'Event',
    }
    return labels[event.category]
  }

  const formatTime = () => {
    if (event.allDay) return 'All day'
    if (event.time) {
      const [hours, minutes] = event.time.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      return `${displayHour}:${minutes} ${ampm}`
    }
    return null
  }

  const getRecurrenceLabel = () => {
    if (event.recurrence === 'weekly') return 'Weekly'
    if (event.recurrence === 'monthly') return 'Monthly'
    return null
  }

  if (compact) {
    return (
      <div className={cn(
        'p-2 rounded-lg border space-y-2',
        'bg-card border-border'
      )}>
        <div className="flex items-start gap-2">
          <div className={cn('p-1 rounded', getCategoryColor())}>
            {getCategoryIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{event.title}</p>
            {formatTime() && (
              <p className="text-xs text-muted-foreground">{formatTime()}</p>
            )}
          </div>
        </div>
        {member && (
          <div className="flex justify-center">
            <MemberAvatar name={member.name} color={member.color} avatarUrl={member.avatarUrl} avatarIcon={member.avatarIcon} size="sm" />
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cn('flex items-center gap-1', getCategoryColor())}>
                {getCategoryIcon()}
                <span className="text-xs font-medium">{getCategoryLabel()}</span>
              </Badge>
              {event.recurrence !== 'none' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <ArrowsClockwise className="h-3 w-3" />
                  <span className="text-xs">{getRecurrenceLabel()}</span>
                </Badge>
              )}
            </div>
            <h3 className="font-heading font-semibold text-lg">{event.title}</h3>
            {event.description && (
              <p className="text-sm text-muted-foreground">{event.description}</p>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(event)}
            >
              <PencilSimple className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(event.id)}
              disabled={!!event.parentEventId}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            {formatTime() && (
              <p className="font-medium">{formatTime()}</p>
            )}
          </div>
          {member && (
            <MemberAvatar name={member.name} color={member.color} avatarUrl={member.avatarUrl} avatarIcon={member.avatarIcon} size="md" />
          )}
        </div>
      </div>
    </Card>
  )
}
