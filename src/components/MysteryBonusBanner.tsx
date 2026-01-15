import { motion } from 'framer-motion'
import { Sparkle, Star } from '@phosphor-icons/react'
import { getMysteryBonusMessage } from '@/lib/helpers'

interface MysteryBonusBannerProps {
  className?: string
}

export function MysteryBonusBanner({ className }: MysteryBonusBannerProps) {
  const message = getMysteryBonusMessage()

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={className}
    >
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 p-[2px]">
        <div className="relative rounded-[10px] bg-background/95 backdrop-blur-sm px-4 py-3">
          {/* Animated background sparkles */}
          <div className="absolute inset-0 overflow-hidden rounded-[10px]">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                  x: [0, Math.random() * 20 - 10],
                  y: [0, Math.random() * 20 - 10],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 2) * 40}%`,
                }}
              >
                <Sparkle
                  className="h-4 w-4 text-amber-400/60"
                  weight="fill"
                />
              </motion.div>
            ))}
          </div>

          <div className="relative flex items-center gap-3">
            {/* Animated star icon */}
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="flex-shrink-0"
            >
              <div className="relative">
                <Star
                  className="h-10 w-10 text-amber-500"
                  weight="fill"
                />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-sm font-bold text-white">2x</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold text-lg bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">
                Mystery Bonus Day!
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {message.replace(/^[✨🎉⭐🌟💫]\s*/, '').replace('Mystery Bonus Day!', '').replace('!', '').trim()}
              </p>
            </div>

            {/* Multiplier badge */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="flex-shrink-0"
            >
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-full px-3 py-1 shadow-lg">
                <span className="text-sm font-bold text-white">×2 STARS</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
