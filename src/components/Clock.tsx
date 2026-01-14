import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'

interface ClockProps {
  showDate?: boolean
  className?: string
}

export function Clock({ showDate = true, className = '' }: ClockProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const hours = format(time, 'h')
  const minutes = format(time, 'mm')
  const seconds = format(time, 'ss')
  const ampm = format(time, 'a')
  const dateStr = format(time, 'EEEE, MMMM d')

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-baseline gap-1">
        <motion.span
          key={hours}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-5xl md:text-6xl font-bold tabular-nums tracking-tight"
        >
          {hours}
        </motion.span>
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          className="font-heading text-4xl md:text-5xl font-bold"
        >
          :
        </motion.span>
        <motion.span
          key={minutes}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-5xl md:text-6xl font-bold tabular-nums tracking-tight"
        >
          {minutes}
        </motion.span>
        <div className="flex flex-col ml-2">
          <span className="text-sm md:text-base font-medium text-muted-foreground tabular-nums">
            {seconds}
          </span>
          <span className="text-sm md:text-base font-semibold text-primary">
            {ampm}
          </span>
        </div>
      </div>
      {showDate && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground text-lg md:text-xl mt-1"
        >
          {dateStr}
        </motion.p>
      )}
    </div>
  )
}
