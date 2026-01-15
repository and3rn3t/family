import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { FamilyMember } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { SpinnerGap, Confetti } from '@phosphor-icons/react'
import { playWheelTickSound, playWheelResultSound } from '@/lib/sounds'

interface ChoreWheelProps {
  members: FamilyMember[]
  onResult: (member: FamilyMember) => void
  soundEnabled?: boolean
}

export function ChoreWheel({ members, onResult, soundEnabled = true }: ChoreWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const controls = useAnimation()
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const numSegments = members.length
  const segmentAngle = 360 / numSegments

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current)
      }
    }
  }, [])

  const spin = useCallback(async () => {
    if (isSpinning || members.length < 2) return

    setIsSpinning(true)
    setSelectedMember(null)
    setShowCelebration(false)

    // Random number of full rotations (3-6) plus random final position
    const fullRotations = 3 + Math.floor(Math.random() * 4)
    const randomSegment = Math.floor(Math.random() * numSegments)
    const finalAngle = fullRotations * 360 + randomSegment * segmentAngle + segmentAngle / 2

    // Play tick sounds during spin
    if (soundEnabled) {
      let tickSpeed = 50
      const startTime = Date.now()
      const spinDuration = 4000

      const tick = () => {
        const elapsed = Date.now() - startTime
        if (elapsed < spinDuration - 500) {
          playWheelTickSound()
          // Slow down ticks as wheel slows
          tickSpeed = 50 + (elapsed / spinDuration) * 200
          tickIntervalRef.current = setTimeout(tick, tickSpeed)
        }
      }
      tickIntervalRef.current = setTimeout(tick, tickSpeed)
    }

    await controls.start({
      rotate: finalAngle,
      transition: {
        duration: 4,
        ease: [0.2, 0.8, 0.3, 1], // Custom easing for realistic spin
      },
    })

    // Clear tick interval
    if (tickIntervalRef.current) {
      clearTimeout(tickIntervalRef.current)
    }

    // Calculate which member was selected
    // The pointer is at the top (0°), so we need to figure out which segment is there
    const normalizedAngle = finalAngle % 360
    const selectedIndex = Math.floor(((360 - normalizedAngle + segmentAngle / 2) % 360) / segmentAngle) % numSegments
    const winner = members[selectedIndex]

    setSelectedMember(winner)
    setShowCelebration(true)
    setIsSpinning(false)

    if (soundEnabled) {
      playWheelResultSound()
    }

    // Notify parent after a short delay
    setTimeout(() => {
      onResult(winner)
    }, 1500)
  }, [isSpinning, members, numSegments, segmentAngle, controls, soundEnabled, onResult])

  if (members.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">Need at least 2 family members to spin the wheel!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Wheel container */}
      <div className="relative">
        {/* Pointer */}
        <div className="absolute left-1/2 -top-2 z-10 -translate-x-1/2">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-primary drop-shadow-lg" />
        </div>

        {/* Wheel */}
        <motion.div
          animate={controls}
          className="relative w-64 h-64 md:w-80 md:h-80"
          style={{ transformOrigin: 'center center' }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
            {/* Outer ring */}
            <circle
              cx="100"
              cy="100"
              r="98"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-border"
            />

            {/* Segments */}
            {members.map((member, index) => {
              const startAngle = index * segmentAngle - 90
              const endAngle = (index + 1) * segmentAngle - 90
              const largeArc = segmentAngle > 180 ? 1 : 0

              const startRad = (startAngle * Math.PI) / 180
              const endRad = (endAngle * Math.PI) / 180

              const x1 = 100 + 95 * Math.cos(startRad)
              const y1 = 100 + 95 * Math.sin(startRad)
              const x2 = 100 + 95 * Math.cos(endRad)
              const y2 = 100 + 95 * Math.sin(endRad)

              const pathData = `M 100 100 L ${x1} ${y1} A 95 95 0 ${largeArc} 1 ${x2} ${y2} Z`

              // Text position (middle of segment)
              const midAngle = (startAngle + endAngle) / 2
              const midRad = (midAngle * Math.PI) / 180
              const textRadius = 60
              const textX = 100 + textRadius * Math.cos(midRad)
              const textY = 100 + textRadius * Math.sin(midRad)

              return (
                <g key={member.id}>
                  <path d={pathData} fill={member.color} className="stroke-background" strokeWidth="2" />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white font-bold text-[10px] md:text-xs"
                    style={{
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                      transform: `rotate(${midAngle + 90}deg)`,
                      transformOrigin: `${textX}px ${textY}px`,
                    }}
                  >
                    {member.name.length > 8 ? member.name.slice(0, 8) + '…' : member.name}
                  </text>
                </g>
              )
            })}

            {/* Center circle */}
            <circle cx="100" cy="100" r="20" className="fill-background stroke-border" strokeWidth="3" />
            <circle cx="100" cy="100" r="8" className="fill-primary" />
          </svg>
        </motion.div>

        {/* Celebration confetti */}
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  scale: [0, 1.5, 2],
                  x: Math.cos((i * Math.PI) / 4) * 120,
                  y: Math.sin((i * Math.PI) / 4) * 120,
                }}
                transition={{ duration: 1, delay: i * 0.05 }}
                className="absolute"
              >
                <Confetti
                  weight="fill"
                  className="w-6 h-6"
                  style={{ color: members[i % members.length]?.color || '#FFD700' }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Result display */}
      {selectedMember && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-lg text-muted-foreground">The wheel has chosen...</p>
          <p
            className="text-3xl font-heading font-bold mt-1"
            style={{ color: selectedMember.color }}
          >
            🎉 {selectedMember.name}! 🎉
          </p>
        </motion.div>
      )}

      {/* Spin button */}
      <Button
        onClick={spin}
        disabled={isSpinning}
        size="lg"
        className="text-lg px-8 py-6"
      >
        {isSpinning ? (
          <>
            <SpinnerGap className="w-5 h-5 mr-2 animate-spin" />
            Spinning...
          </>
        ) : (
          <>
            🎡 Spin the Wheel!
          </>
        )}
      </Button>
    </div>
  )
}
