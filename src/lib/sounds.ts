// Sound effects for the Family Organizer app
// Using Web Audio API for simple, lightweight sounds

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

// Play a simple tone
function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  } catch (e) {
    // Silently fail if audio isn't available
    console.debug('Audio not available:', e)
  }
}

// Play a sequence of tones
function playSequence(notes: { freq: number; duration: number; delay: number }[], volume: number = 0.3) {
  notes.forEach((note) => {
    setTimeout(() => {
      playTone(note.freq, note.duration, 'sine', volume)
    }, note.delay * 1000)
  })
}

// Celebration sound - happy ascending notes
export function playCelebrationSound() {
  playSequence([
    { freq: 523.25, duration: 0.1, delay: 0 },      // C5
    { freq: 659.25, duration: 0.1, delay: 0.1 },    // E5
    { freq: 783.99, duration: 0.15, delay: 0.2 },   // G5
    { freq: 1046.50, duration: 0.3, delay: 0.35 },  // C6
  ], 0.25)
}

// Achievement unlock sound - triumphant fanfare
export function playAchievementSound() {
  playSequence([
    { freq: 392.00, duration: 0.15, delay: 0 },     // G4
    { freq: 523.25, duration: 0.15, delay: 0.15 },  // C5
    { freq: 659.25, duration: 0.15, delay: 0.30 },  // E5
    { freq: 783.99, duration: 0.4, delay: 0.45 },   // G5
  ], 0.3)
}

// Click/tap sound - subtle feedback
export function playClickSound() {
  playTone(800, 0.05, 'sine', 0.15)
}

// Undo sound - descending notes
export function playUndoSound() {
  playSequence([
    { freq: 600, duration: 0.08, delay: 0 },
    { freq: 400, duration: 0.1, delay: 0.08 },
  ], 0.2)
}

// Error sound - low buzz
export function playErrorSound() {
  playTone(200, 0.15, 'square', 0.15)
}

// Success sound - simple pleasant chime
export function playSuccessSound() {
  playSequence([
    { freq: 880, duration: 0.1, delay: 0 },
    { freq: 1108.73, duration: 0.15, delay: 0.1 },
  ], 0.2)
}
