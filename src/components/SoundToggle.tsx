import { SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface SoundToggleProps {
  enabled: boolean
  onToggle: () => void
}

export function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="relative h-10 w-10 rounded-full"
      aria-label={enabled ? 'Mute sound effects' : 'Enable sound effects'}
    >
      <motion.div
        initial={false}
        animate={{
          scale: enabled ? 1 : 0,
          opacity: enabled ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="absolute"
      >
        <SpeakerHigh className="h-5 w-5 text-primary" weight="fill" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          scale: enabled ? 0 : 1,
          opacity: enabled ? 0 : 1,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="absolute"
      >
        <SpeakerSlash className="h-5 w-5 text-muted-foreground" weight="fill" />
      </motion.div>
    </Button>
  )
}
