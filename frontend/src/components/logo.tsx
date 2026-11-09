import logoIcon from '@/assets/logo-icon.svg'
import logo from '@/assets/logo.svg'
import { cn } from '@/lib/utils'

interface LogoProps {
  /** `full` shows the icon and the name; `icon` only the symbol */
  variant?: 'full' | 'icon'
  className?: string
}

export function Logo({ variant = 'full', className }: LogoProps) {
  if (variant === 'icon') {
    return <img src={logoIcon} alt="Financy" width={40} height={40} className={className} />
  }

  return (
    <img src={logo} alt="Financy" width={134} height={32} className={cn('h-8 w-auto', className)} />
  )
}
