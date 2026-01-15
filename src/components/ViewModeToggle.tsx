import { useState } from 'react'
import { Eye, EyeSlash, Lock } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface ViewModeToggleProps {
  isViewOnly: boolean
  onToggle: (viewOnly: boolean) => void
  pin?: string
}

export function ViewModeToggle({ isViewOnly, onToggle, pin }: ViewModeToggleProps) {
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [enteredPin, setEnteredPin] = useState('')
  const [error, setError] = useState('')

  const handleToggleClick = () => {
    if (isViewOnly) {
      // Trying to exit view-only mode
      if (pin) {
        // PIN is set, require it to exit
        setShowPinDialog(true)
        setEnteredPin('')
        setError('')
      } else {
        // No PIN, just toggle
        onToggle(false)
        toast.success('Edit mode enabled', {
          description: 'You can now make changes.',
        })
      }
    } else {
      // Entering view-only mode - no PIN needed
      onToggle(true)
      toast.info('View-only mode enabled', {
        description: 'All editing is disabled.',
      })
    }
  }

  const handlePinSubmit = () => {
    if (enteredPin === pin) {
      setShowPinDialog(false)
      setEnteredPin('')
      setError('')
      onToggle(false)
      toast.success('Edit mode enabled', {
        description: 'PIN accepted. You can now make changes.',
      })
    } else {
      setError('Incorrect PIN')
      setEnteredPin('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePinSubmit()
    }
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleClick}
              className={isViewOnly ? 'text-amber-500' : 'text-muted-foreground'}
            >
              {isViewOnly ? (
                <EyeSlash className="h-5 w-5" weight="fill" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isViewOnly ? 'Exit view-only mode' : 'Enter view-only mode'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Enter PIN to Edit
            </DialogTitle>
            <DialogDescription>
              View-only mode is protected. Enter the PIN to enable editing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="password"
              placeholder="Enter PIN"
              value={enteredPin}
              onChange={(e) => {
                setEnteredPin(e.target.value)
                setError('')
              }}
              onKeyDown={handleKeyDown}
              maxLength={6}
              className="text-center text-2xl tracking-widest"
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPinDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handlePinSubmit} className="flex-1">
                Unlock
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Visual indicator shown when in view-only mode
export function ViewOnlyBanner() {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-amber-500/90 text-amber-950 text-sm font-medium flex items-center gap-2 shadow-lg backdrop-blur-sm">
      <Eye className="h-4 w-4" weight="fill" />
      View-only mode
    </div>
  )
}
