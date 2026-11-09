import { RadioGroup } from 'radix-ui'
import { createElement, useId } from 'react'

import {
  CATEGORY_COLOR_LABELS,
  CATEGORY_COLORS,
  getCategoryColorClasses,
} from '@/lib/category-colors'
import { CATEGORY_ICON_LABELS, CATEGORY_ICON_NAMES, CATEGORY_ICONS } from '@/lib/category-icons'
import { cn } from '@/lib/utils'

const optionClasses =
  'flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors outline-none hover:bg-gray-100 focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=checked]:border-brand-base data-[state=checked]:bg-gray-100'

interface PickerProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

function PickerLabel({ id, children }: { id: string; children: string }) {
  return (
    <span id={id} className="text-sm font-medium text-gray-700">
      {children}
    </span>
  )
}

function PickerError({ message }: { message?: string }) {
  return message ? <p className="text-xs text-danger">{message}</p> : null
}

/** Grid with the 16 category icons. */
export function IconPicker({ value, onChange, error }: PickerProps) {
  const labelId = useId()

  return (
    <div className="flex flex-col gap-2">
      <PickerLabel id={labelId}>Ícone</PickerLabel>
      <RadioGroup.Root
        aria-labelledby={labelId}
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-8 gap-2"
      >
        {CATEGORY_ICON_NAMES.map((name) => (
          <RadioGroup.Item
            key={name}
            value={name}
            aria-label={CATEGORY_ICON_LABELS[name]}
            className={cn(optionClasses, 'aspect-square')}
          >
            {createElement(CATEGORY_ICONS[name], { 'aria-hidden': true, className: 'size-5' })}
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
      <PickerError message={error} />
    </div>
  )
}

/** Row with the 7 category colors. */
export function ColorPicker({ value, onChange, error }: PickerProps) {
  const labelId = useId()

  return (
    <div className="flex flex-col gap-2">
      <PickerLabel id={labelId}>Cor</PickerLabel>
      <RadioGroup.Root
        aria-labelledby={labelId}
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-7 gap-2"
      >
        {CATEGORY_COLORS.map((color) => (
          <RadioGroup.Item
            key={color}
            value={color}
            aria-label={CATEGORY_COLOR_LABELS[color]}
            className={cn(optionClasses, 'h-7.5 p-[5px]')}
          >
            <span className={cn('size-full rounded', getCategoryColorClasses(color).swatch)} />
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
      <PickerError message={error} />
    </div>
  )
}
