import type { LucideIcon } from 'lucide-react'
import { type ComponentProps, type ReactNode, useId } from 'react'

import { cn } from '@/lib/utils'

export interface TextFieldProps extends ComponentProps<'input'> {
  label: string
  /** Lucide icon shown before the value */
  icon?: LucideIcon
  /** Helper text below the field */
  helper?: string
  /** Error message; replaces the helper and highlights the field */
  error?: string
  /** Element after the value, e.g. a toggle button */
  endAdornment?: ReactNode
}

/** "Input" from the Figma Style Guide: label, bordered box with optional icons and helper. */
export function TextField({
  label,
  icon: Icon,
  helper,
  error,
  endAdornment,
  className,
  id,
  disabled,
  ...props
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  const message = error ?? helper
  const hasError = Boolean(error)

  return (
    <div className={cn('group flex flex-col gap-2', disabled && 'opacity-50', className)}>
      <label
        htmlFor={inputId}
        className={cn(
          'text-sm font-medium text-gray-700',
          hasError ? 'text-danger' : 'group-focus-within:text-brand-base',
        )}
      >
        {label}
      </label>

      <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-[13px] py-[15px]">
        {Icon && (
          <Icon
            aria-hidden
            className={cn(
              'size-4 shrink-0',
              hasError
                ? 'text-danger'
                : 'text-gray-400 group-focus-within:text-brand-base! group-has-[input:not(:placeholder-shown)]:text-gray-800',
            )}
          />
        )}

        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={message ? messageId : undefined}
          className="min-w-0 flex-1 bg-transparent text-base leading-[18px] text-gray-800 caret-brand-base outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
          {...props}
        />

        {endAdornment}
      </div>

      {message && (
        <p id={messageId} className={cn('text-xs', hasError ? 'text-danger' : 'text-gray-500')}>
          {message}
        </p>
      )}
    </div>
  )
}
