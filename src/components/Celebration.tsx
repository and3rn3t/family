import { motion, AnimatePresence } from 'framer-motion'
import { Check } from '@phosphor-icons/react'

interface CelebrationProps {
  show: boolean
}

export function Celebration({ show }: CelebrationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ 
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
            className="bg-secondary rounded-full p-8 shadow-2xl"
          >
            <Check className="h-24 w-24 text-secondary-foreground" weight="bold" />
          </motion.div>
          
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 1,
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: 0,
                scale: 1,
                x: Math.cos((i / 12) * Math.PI * 2) * 200,
                y: Math.sin((i / 12) * Math.PI * 2) * 200,
              }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: i % 3 === 0 
                  ? 'oklch(0.72 0.14 25)' 
                  : i % 3 === 1 
                  ? 'oklch(0.75 0.09 290)' 
                  : 'oklch(0.85 0.15 95)',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
