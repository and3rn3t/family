import { Moon, Sun } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface ThemeToggleProps {
  isDark: boolean
  onToggle: () => void
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="relative h-10 w-10 rounded-full"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 0 : 1,
          opacity: isDark ? 0 : 1,
          rotate: isDark ? -90 : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="absolute"
      >
        <Sun className="h-5 w-5 text-amber-500" weight="fill" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 1 : 0,
          opacity: isDark ? 1 : 0,
          rotate: isDark ? 0 : 90,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="absolute"
      >
        <Moon className="h-5 w-5 text-indigo-400" weight="fill" />
      </motion.div>
    </Button>
  )
}
