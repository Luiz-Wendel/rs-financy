import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/lib/utils'

/** "Label Button" and "Icon Button" from the Figma Style Guide. */
const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        solid: 'bg-brand-base text-white hover:bg-brand-dark',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-200',
        danger: 'border border-gray-300 bg-white text-danger hover:bg-gray-200',
      },
      size: {
        md: "h-12 px-4 text-base [&_svg:not([class*='size-'])]:size-4.5",
        sm: "h-9 px-3 text-sm [&_svg:not([class*='size-'])]:size-4",
        icon: "size-8 p-2 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
    },
  },
)

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      // Avoid accidental form submissions: buttons are "button" unless told otherwise
      type={asChild ? type : (type ?? 'button')}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
