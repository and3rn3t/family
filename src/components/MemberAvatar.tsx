import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/helpers'
import { cn } from '@/lib/utils'

interface MemberAvatarProps {
  name: string
  color: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MemberAvatar({ name, color, size = 'md', className }: MemberAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-xl',
  }

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarFallback 
        style={{ backgroundColor: color }}
        className="text-white font-semibold"
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
