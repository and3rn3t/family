import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/helpers'
import { cn } from '@/lib/utils'

interface MemberAvatarProps {
  name: string
  color: string
  avatarUrl?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MemberAvatar({ name, color, avatarUrl, size = 'md', className }: MemberAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-xl',
  }

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
      <AvatarFallback 
        style={{ backgroundColor: color }}
        className="text-white font-semibold"
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
