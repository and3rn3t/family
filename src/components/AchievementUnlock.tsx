import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Achievement } from '@/lib/types'
import { getRarityColor } from '@/lib/achievements'
import {
  Star,
  Trophy,
  CheckCircle,
  Fire,
  Lightning,
  TrendUp,
  Rocket,
  Sparkle,
} from '@phosphor-icons/react'

interface AchievementUnlockProps {
  achievement: Achievement | null
  onComplete: () => void
}

const iconMap: Record<string, React.ElementType> = {
  Star,
  Trophy,
  CheckCircle,
  Fire,
  Lightning,
  TrendUp,
  Rocket,
  Sparkle,
}

export function AchievementUnlock({ achievement, onComplete }: AchievementUnlockProps) {
  if (!achievement) return null

  const Icon = iconMap[achievement.icon] || Star
  const rarityColor = getRarityColor(achievement.rarity)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -50 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
        onAnimationComplete={() => {
          setTimeout(onComplete, 3000)
        }}
      >
        <motion.div
          initial={{ rotate: -5 }}
          animate={{ rotate: 5 }}
          transition={{
            repeat: 3,
            repeatType: 'reverse',
            duration: 0.2,
          }}
        >
          <Card className="pointer-events-auto max-w-md w-full p-6 shadow-2xl border-4 bg-gradient-to-br from-background to-accent/20">
            <div className="space-y-4 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="flex justify-center"
              >
                <div
                  className="p-6 rounded-2xl"
                  style={{
                    backgroundColor: `${rarityColor}20`,
                    boxShadow: `0 0 30px ${rarityColor}40`,
                  }}
                >
                  <Icon
                    weight="fill"
                    className="h-16 w-16"
                    style={{ color: rarityColor }}
                  />
                </div>
              </motion.div>

              <div className="space-y-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Achievement Unlocked!
                  </p>
                  <h3 className="font-heading text-3xl font-bold" style={{ color: rarityColor }}>
                    {achievement.title}
                  </h3>
                  <p className="text-muted-foreground mt-2">{achievement.description}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="pt-2"
                >
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                    style={{
                      backgroundColor: `${rarityColor}20`,
                      color: rarityColor,
                    }}
                  >
                    {achievement.rarity.toUpperCase()}
                  </span>
                </motion.div>
              </div>
            </div>

            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: 2 }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{
                    top: '50%',
                    left: '50%',
                    opacity: 1,
                  }}
                  animate={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                  }}
                >
                  <Sparkle
                    weight="fill"
                    className="h-4 w-4"
                    style={{ color: rarityColor }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
