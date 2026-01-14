import { Palette, Check } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { COLOR_THEMES } from '@/lib/themes'
import { cn } from '@/lib/utils'

interface ThemeSelectorProps {
  currentTheme: string
  onSelectTheme: (themeId: string) => void
}

export function ThemeSelector({ currentTheme, onSelectTheme }: ThemeSelectorProps) {
  const selectedTheme = COLOR_THEMES.find((t) => t.id === currentTheme) || COLOR_THEMES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full"
          aria-label="Select color theme"
        >
          <span className="text-lg">{selectedTheme.emoji}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {COLOR_THEMES.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => onSelectTheme(theme.id)}
            className={cn(
              'flex items-center gap-3 cursor-pointer',
              currentTheme === theme.id && 'bg-accent'
            )}
          >
            <span className="text-lg">{theme.emoji}</span>
            <div className="flex-1">
              <div className="font-medium">{theme.name}</div>
              <div className="text-xs text-muted-foreground">{theme.description}</div>
            </div>
            {currentTheme === theme.id && (
              <Check className="h-4 w-4 text-primary" weight="bold" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
