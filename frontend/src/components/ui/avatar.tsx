import { cva, type VariantProps } from 'class-variance-authority'

import { getInitials } from '@/lib/initials'
import { cn } from '@/lib/utils'

const avatarVariants = cva(
  'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-300 font-medium text-gray-800 select-none',
  {
    variants: {
      size: {
        sm: 'size-9 text-sm',
        lg: 'size-16 text-2xl',
      },
    },
    defaultVariants: { size: 'sm' },
  },
)

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  name: string
  className?: string
}

/** Circle with the user's initials (navbar: sm, profile page: lg). */
export function Avatar({ name, size, className }: AvatarProps) {
  return (
    <span className={cn(avatarVariants({ size }), className)} aria-hidden>
      {getInitials(name)}
    </span>
  )
}
