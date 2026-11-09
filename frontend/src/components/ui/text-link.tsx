import { Slot } from 'radix-ui'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/** "Link" from the Figma Style Guide: brand-colored text underlined on hover. */
export function TextLink({
  asChild = false,
  className,
  ...props
}: ComponentProps<'a'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'a'

  return (
    <Comp
      className={cn(
        'inline-flex items-center gap-1 border-b border-transparent text-sm font-medium text-brand-base transition-colors outline-none hover:border-brand-base focus-visible:border-brand-base [&_svg]:size-5',
        className,
      )}
      {...props}
    />
  )
}
