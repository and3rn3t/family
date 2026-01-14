import { FamilyMember, Chore } from '@/lib/types'
import { MemberAvatar } from './MemberAvatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { getNextDueDate, isChoreComplete, isChoreOverdue } from '@/lib/helpers'
import { cn } from '@/lib/utils'

interface ScheduleViewProps {
  members: FamilyMember[]
  chores: Chore[]
}

export function ScheduleView({ members, chores }: ScheduleViewProps) {
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    return date
  })

  const getChoresForDay = (date: Date) => {
    return chores.filter((chore) => {
      const dueDate = getNextDueDate(chore)
      return dueDate.toDateString() === date.toDateString()
    })
  }

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  if (members.length === 0 || chores.length === 0) {
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
      <div>
        <h2 className="font-heading text-3xl font-bold tracking-tight">Weekly Schedule</h2>
        <p className="text-muted-foreground mt-1">
          View upcoming chores for the week
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {days.map((date, index) => {
          const dayChores = getChoresForDay(date)
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
          const dayNumber = date.getDate()

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
                  {dayChores.length === 0 ? (
                    <p className="text-xs text-center text-muted-foreground">
                      No chores
                    </p>
                  ) : (
                    dayChores.map((chore) => {
                      const member = members.find((m) => m.id === chore.assignedTo)
                      const complete = isChoreComplete(chore)
                      const overdue = isChoreOverdue(chore)

                      return (
                        <div
                          key={chore.id}
                          className={cn(
                            'p-2 rounded-lg border space-y-2',
                            complete && 'bg-[oklch(0.95_0.05_290)] border-[oklch(0.75_0.09_290)]',
                            overdue && !complete && 'border-accent bg-accent/10'
                          )}
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
                    })
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
