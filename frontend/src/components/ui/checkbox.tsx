import { Check } from 'lucide-react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import { type ComponentProps, useId } from 'react'

import { cn } from '@/lib/utils'

interface CheckboxProps extends ComponentProps<typeof CheckboxPrimitive.Root> {
  label: string
}

export function Checkbox({ label, id, className, ...props }: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <CheckboxPrimitive.Root
        id={checkboxId}
        className="flex size-4 shrink-0 items-center justify-center rounded-sm border border-gray-300 bg-white transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 data-[state=checked]:border-brand-base data-[state=checked]:bg-brand-base"
        {...props}
      >
        <CheckboxPrimitive.Indicator>
          <Check aria-hidden className="size-3 text-white" strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label htmlFor={checkboxId} className="text-sm text-gray-700 select-none">
        {label}
      </label>
    </div>
  )
}
