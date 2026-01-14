import { useState, useEffect } from 'react'
import { Clock } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

interface EventCountdownProps {
  eventTime: string
  allDay?: boolean
}

export function EventCountdown({ eventTime, allDay }: EventCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const [isNow, setIsNow] = useState(false)

  useEffect(() => {
    if (allDay || !eventTime) {
      setTimeRemaining('')
      return
    }

    const updateCountdown = () => {
      const now = new Date()
      const [hours, minutes] = eventTime.split(':').map(Number)
      
      const eventDate = new Date()
      eventDate.setHours(hours, minutes, 0, 0)

      const diffMs = eventDate.getTime() - now.getTime()
      
      if (diffMs < 0) {
        setTimeRemaining('')
        return
      }

      if (diffMs < 60000) {
        setIsNow(true)
        setTimeRemaining('Now')
        return
      }

      setIsNow(false)

      const totalMinutes = Math.floor(diffMs / 60000)
      const displayHours = Math.floor(totalMinutes / 60)
      const displayMinutes = totalMinutes % 60

      if (displayHours > 0) {
        setTimeRemaining(`${displayHours}h ${displayMinutes}m`)
      } else {
        setTimeRemaining(`${displayMinutes}m`)
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 10000)

    return () => clearInterval(interval)
  }, [eventTime, allDay])

  if (!timeRemaining || allDay) {
    return null
  }

  return (
    <Badge 
      variant={isNow ? "default" : "outline"} 
      className={isNow ? "bg-accent text-accent-foreground animate-pulse" : ""}
    >
      <Clock className="h-3 w-3 mr-1" />
      {isNow ? 'Starting Now!' : `in ${timeRemaining}`}
    </Badge>
  )
}
