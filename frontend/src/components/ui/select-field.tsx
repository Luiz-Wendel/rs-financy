import { Check, ChevronDown, type LucideIcon } from 'lucide-react'
import { Select as SelectPrimitive } from 'radix-ui'
import { useId } from 'react'

import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps {
  label: string
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  icon?: LucideIcon
  helper?: string
  error?: string
  disabled?: boolean
  name?: string
  className?: string
}

/** "Input / Select" from the Figma Style Guide, built on the Radix Select. */
export function SelectField({
  label,
  options,
  value,
  onValueChange,
  placeholder = 'Selecione',
  icon: Icon,
  helper,
  error,
  disabled,
  name,
  className,
}: SelectFieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? helper
  const hasError = Boolean(error)

  return (
    <div className={cn('group flex flex-col gap-2', disabled && 'opacity-50', className)}>
      <label
        htmlFor={id}
        className={cn(
          'text-sm font-medium text-gray-700',
          hasError ? 'text-danger' : 'group-focus-within:text-brand-base',
        )}
      >
        {label}
      </label>

      <SelectPrimitive.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        name={name}
      >
        <SelectPrimitive.Trigger
          id={id}
          aria-invalid={hasError || undefined}
          aria-describedby={message ? messageId : undefined}
          className="flex h-12 w-full items-center gap-3 rounded-lg border border-gray-300 bg-white px-[13px] text-left text-base leading-[18px] text-gray-800 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed data-placeholder:text-gray-400 [&>span]:min-w-0 [&>span]:flex-1 [&>span]:truncate"
        >
          {Icon && (
            <Icon
              aria-hidden
              className={cn('size-4 shrink-0', hasError ? 'text-danger' : 'text-gray-800')}
            />
          )}
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDown
              aria-hidden
              className="size-4 shrink-0 text-gray-700 transition-transform group-has-data-[state=open]:rotate-180"
            />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={8}
            className="z-50 max-h-(--radix-select-content-available-height) w-(--radix-select-trigger-width) overflow-y-auto rounded-lg border border-gray-300 bg-white px-[13px] py-[15px] shadow-[0_4px_7.5px_rgba(0,0,0,0.1)] data-[state=open]:animate-in data-[state=open]:fade-in-0"
          >
            <SelectPrimitive.Viewport className="flex flex-col gap-4">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className="flex cursor-pointer items-center gap-2 text-base leading-[18px] text-gray-800 outline-none select-none data-highlighted:text-brand-base data-[state=checked]:font-medium"
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="ml-auto">
                    <Check aria-hidden className="size-5 text-success" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {message && (
        <p id={messageId} className={cn('text-xs', hasError ? 'text-danger' : 'text-gray-500')}>
          {message}
        </p>
      )}
    </div>
  )
}
