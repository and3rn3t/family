export interface ColorTheme {
  id: string
  name: string
  emoji: string
  description: string
  colors: {
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    accent: string
    accentForeground: string
    muted: string
    mutedForeground: string
    background: string
    foreground: string
    card: string
    cardForeground: string
    border: string
    ring: string
  }
  darkColors: {
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    accent: string
    accentForeground: string
    muted: string
    mutedForeground: string
    background: string
    foreground: string
    card: string
    cardForeground: string
    border: string
    ring: string
  }
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'default',
    name: 'Warm Earth',
    emoji: '🌾',
    description: 'Warm, earthy tones - the default cozy theme',
    colors: {
      primary: 'oklch(0.48 0.12 75)',
      primaryForeground: 'oklch(0.98 0.008 85)',
      secondary: 'oklch(0.90 0.05 90)',
      secondaryForeground: 'oklch(0.25 0.02 45)',
      accent: 'oklch(0.72 0.08 110)',
      accentForeground: 'oklch(0.20 0.02 45)',
      muted: 'oklch(0.94 0.01 85)',
      mutedForeground: 'oklch(0.48 0.01 45)',
      background: 'oklch(0.98 0.008 85)',
      foreground: 'oklch(0.20 0.02 45)',
      card: 'oklch(0.99 0.005 85)',
      cardForeground: 'oklch(0.20 0.02 45)',
      border: 'oklch(0.88 0.02 85)',
      ring: 'oklch(0.48 0.12 75)',
    },
    darkColors: {
      primary: 'oklch(0.65 0.15 75)',
      primaryForeground: 'oklch(0.15 0.02 260)',
      secondary: 'oklch(0.25 0.03 260)',
      secondaryForeground: 'oklch(0.90 0.01 85)',
      accent: 'oklch(0.55 0.12 110)',
      accentForeground: 'oklch(0.95 0.01 85)',
      muted: 'oklch(0.22 0.02 260)',
      mutedForeground: 'oklch(0.65 0.02 85)',
      background: 'oklch(0.15 0.02 260)',
      foreground: 'oklch(0.95 0.01 85)',
      card: 'oklch(0.18 0.02 260)',
      cardForeground: 'oklch(0.95 0.01 85)',
      border: 'oklch(0.28 0.02 260)',
      ring: 'oklch(0.65 0.15 75)',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    emoji: '🌊',
    description: 'Cool, calming blues and teals',
    colors: {
      primary: 'oklch(0.55 0.15 220)',
      primaryForeground: 'oklch(0.98 0.01 220)',
      secondary: 'oklch(0.88 0.06 200)',
      secondaryForeground: 'oklch(0.25 0.03 220)',
      accent: 'oklch(0.65 0.12 180)',
      accentForeground: 'oklch(0.20 0.02 220)',
      muted: 'oklch(0.94 0.02 210)',
      mutedForeground: 'oklch(0.45 0.03 220)',
      background: 'oklch(0.98 0.01 210)',
      foreground: 'oklch(0.18 0.03 220)',
      card: 'oklch(0.99 0.008 210)',
      cardForeground: 'oklch(0.18 0.03 220)',
      border: 'oklch(0.86 0.03 210)',
      ring: 'oklch(0.55 0.15 220)',
    },
    darkColors: {
      primary: 'oklch(0.68 0.14 220)',
      primaryForeground: 'oklch(0.12 0.02 220)',
      secondary: 'oklch(0.25 0.04 220)',
      secondaryForeground: 'oklch(0.90 0.02 210)',
      accent: 'oklch(0.55 0.12 180)',
      accentForeground: 'oklch(0.95 0.01 210)',
      muted: 'oklch(0.20 0.03 220)',
      mutedForeground: 'oklch(0.65 0.03 210)',
      background: 'oklch(0.12 0.03 220)',
      foreground: 'oklch(0.95 0.01 210)',
      card: 'oklch(0.16 0.03 220)',
      cardForeground: 'oklch(0.95 0.01 210)',
      border: 'oklch(0.25 0.03 220)',
      ring: 'oklch(0.68 0.14 220)',
    },
  },
  {
    id: 'forest',
    name: 'Forest Grove',
    emoji: '🌲',
    description: 'Natural greens and warm browns',
    colors: {
      primary: 'oklch(0.50 0.12 145)',
      primaryForeground: 'oklch(0.98 0.01 145)',
      secondary: 'oklch(0.88 0.05 90)',
      secondaryForeground: 'oklch(0.25 0.03 145)',
      accent: 'oklch(0.65 0.10 80)',
      accentForeground: 'oklch(0.20 0.02 145)',
      muted: 'oklch(0.94 0.02 130)',
      mutedForeground: 'oklch(0.45 0.03 145)',
      background: 'oklch(0.98 0.01 120)',
      foreground: 'oklch(0.18 0.03 145)',
      card: 'oklch(0.99 0.008 120)',
      cardForeground: 'oklch(0.18 0.03 145)',
      border: 'oklch(0.86 0.03 130)',
      ring: 'oklch(0.50 0.12 145)',
    },
    darkColors: {
      primary: 'oklch(0.62 0.14 145)',
      primaryForeground: 'oklch(0.12 0.02 145)',
      secondary: 'oklch(0.22 0.04 145)',
      secondaryForeground: 'oklch(0.90 0.02 130)',
      accent: 'oklch(0.55 0.10 80)',
      accentForeground: 'oklch(0.95 0.01 130)',
      muted: 'oklch(0.18 0.03 145)',
      mutedForeground: 'oklch(0.65 0.03 130)',
      background: 'oklch(0.12 0.03 145)',
      foreground: 'oklch(0.95 0.01 130)',
      card: 'oklch(0.15 0.03 145)',
      cardForeground: 'oklch(0.95 0.01 130)',
      border: 'oklch(0.24 0.03 145)',
      ring: 'oklch(0.62 0.14 145)',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    emoji: '🌅',
    description: 'Warm oranges and coral pinks',
    colors: {
      primary: 'oklch(0.62 0.18 35)',
      primaryForeground: 'oklch(0.98 0.01 35)',
      secondary: 'oklch(0.90 0.08 50)',
      secondaryForeground: 'oklch(0.25 0.03 35)',
      accent: 'oklch(0.72 0.14 15)',
      accentForeground: 'oklch(0.20 0.02 35)',
      muted: 'oklch(0.94 0.03 40)',
      mutedForeground: 'oklch(0.48 0.04 35)',
      background: 'oklch(0.98 0.015 45)',
      foreground: 'oklch(0.20 0.03 35)',
      card: 'oklch(0.99 0.01 45)',
      cardForeground: 'oklch(0.20 0.03 35)',
      border: 'oklch(0.88 0.04 45)',
      ring: 'oklch(0.62 0.18 35)',
    },
    darkColors: {
      primary: 'oklch(0.68 0.18 35)',
      primaryForeground: 'oklch(0.12 0.02 35)',
      secondary: 'oklch(0.25 0.05 35)',
      secondaryForeground: 'oklch(0.90 0.02 45)',
      accent: 'oklch(0.58 0.14 15)',
      accentForeground: 'oklch(0.95 0.01 45)',
      muted: 'oklch(0.20 0.04 35)',
      mutedForeground: 'oklch(0.65 0.04 45)',
      background: 'oklch(0.12 0.03 35)',
      foreground: 'oklch(0.95 0.01 45)',
      card: 'oklch(0.16 0.03 35)',
      cardForeground: 'oklch(0.95 0.01 45)',
      border: 'oklch(0.26 0.04 35)',
      ring: 'oklch(0.68 0.18 35)',
    },
  },
  {
    id: 'lavender',
    name: 'Lavender Dreams',
    emoji: '💜',
    description: 'Soft purples and gentle lavenders',
    colors: {
      primary: 'oklch(0.55 0.14 290)',
      primaryForeground: 'oklch(0.98 0.01 290)',
      secondary: 'oklch(0.90 0.06 285)',
      secondaryForeground: 'oklch(0.25 0.03 290)',
      accent: 'oklch(0.68 0.12 310)',
      accentForeground: 'oklch(0.20 0.02 290)',
      muted: 'oklch(0.94 0.03 290)',
      mutedForeground: 'oklch(0.48 0.04 290)',
      background: 'oklch(0.98 0.012 290)',
      foreground: 'oklch(0.20 0.03 290)',
      card: 'oklch(0.99 0.008 290)',
      cardForeground: 'oklch(0.20 0.03 290)',
      border: 'oklch(0.88 0.04 290)',
      ring: 'oklch(0.55 0.14 290)',
    },
    darkColors: {
      primary: 'oklch(0.68 0.14 290)',
      primaryForeground: 'oklch(0.12 0.02 290)',
      secondary: 'oklch(0.22 0.05 290)',
      secondaryForeground: 'oklch(0.90 0.02 285)',
      accent: 'oklch(0.55 0.12 310)',
      accentForeground: 'oklch(0.95 0.01 285)',
      muted: 'oklch(0.18 0.04 290)',
      mutedForeground: 'oklch(0.65 0.04 285)',
      background: 'oklch(0.12 0.03 290)',
      foreground: 'oklch(0.95 0.01 285)',
      card: 'oklch(0.15 0.03 290)',
      cardForeground: 'oklch(0.95 0.01 285)',
      border: 'oklch(0.24 0.04 290)',
      ring: 'oklch(0.68 0.14 290)',
    },
  },
  {
    id: 'mint',
    name: 'Fresh Mint',
    emoji: '🍃',
    description: 'Clean, refreshing mint greens',
    colors: {
      primary: 'oklch(0.58 0.12 165)',
      primaryForeground: 'oklch(0.98 0.01 165)',
      secondary: 'oklch(0.90 0.06 160)',
      secondaryForeground: 'oklch(0.25 0.03 165)',
      accent: 'oklch(0.70 0.10 180)',
      accentForeground: 'oklch(0.20 0.02 165)',
      muted: 'oklch(0.94 0.03 165)',
      mutedForeground: 'oklch(0.45 0.04 165)',
      background: 'oklch(0.98 0.012 165)',
      foreground: 'oklch(0.18 0.03 165)',
      card: 'oklch(0.99 0.008 165)',
      cardForeground: 'oklch(0.18 0.03 165)',
      border: 'oklch(0.86 0.04 165)',
      ring: 'oklch(0.58 0.12 165)',
    },
    darkColors: {
      primary: 'oklch(0.65 0.12 165)',
      primaryForeground: 'oklch(0.12 0.02 165)',
      secondary: 'oklch(0.20 0.04 165)',
      secondaryForeground: 'oklch(0.90 0.02 160)',
      accent: 'oklch(0.55 0.10 180)',
      accentForeground: 'oklch(0.95 0.01 160)',
      muted: 'oklch(0.16 0.03 165)',
      mutedForeground: 'oklch(0.65 0.03 160)',
      background: 'oklch(0.10 0.03 165)',
      foreground: 'oklch(0.95 0.01 160)',
      card: 'oklch(0.14 0.03 165)',
      cardForeground: 'oklch(0.95 0.01 160)',
      border: 'oklch(0.22 0.03 165)',
      ring: 'oklch(0.65 0.12 165)',
    },
  },
]

export function getThemeById(id: string): ColorTheme {
  return COLOR_THEMES.find((t) => t.id === id) || COLOR_THEMES[0]
}

export function applyTheme(themeId: string, isDark: boolean) {
  const theme = getThemeById(themeId)
  const colors = isDark ? theme.darkColors : theme.colors
  const root = document.documentElement

  root.style.setProperty('--primary', colors.primary)
  root.style.setProperty('--primary-foreground', colors.primaryForeground)
  root.style.setProperty('--secondary', colors.secondary)
  root.style.setProperty('--secondary-foreground', colors.secondaryForeground)
  root.style.setProperty('--accent', colors.accent)
  root.style.setProperty('--accent-foreground', colors.accentForeground)
  root.style.setProperty('--muted', colors.muted)
  root.style.setProperty('--muted-foreground', colors.mutedForeground)
  root.style.setProperty('--background', colors.background)
  root.style.setProperty('--foreground', colors.foreground)
  root.style.setProperty('--card', colors.card)
  root.style.setProperty('--card-foreground', colors.cardForeground)
  root.style.setProperty('--border', colors.border)
  root.style.setProperty('--ring', colors.ring)
}
