/** Category colors accepted by the API (same order as the color picker in the Figma layout). */
export const CATEGORY_COLORS = [
  'green',
  'blue',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
] as const

export type CategoryColor = (typeof CATEGORY_COLORS)[number]

interface ColorClasses {
  /** Tag/badge: light background with dark text */
  tag: string
  /** Icon bubble: light background with the base color on the icon */
  icon: string
  /** Solid swatch used in the color picker */
  swatch: string
  /** Base color for text and icons */
  text: string
}

// Full class names are listed so Tailwind can find them in the source.
const colorClasses: Record<CategoryColor, ColorClasses> = {
  green: {
    tag: 'bg-green-light text-green-dark',
    icon: 'bg-green-light text-green-base',
    swatch: 'bg-green-base',
    text: 'text-green-base',
  },
  blue: {
    tag: 'bg-blue-light text-blue-dark',
    icon: 'bg-blue-light text-blue-base',
    swatch: 'bg-blue-base',
    text: 'text-blue-base',
  },
  purple: {
    tag: 'bg-purple-light text-purple-dark',
    icon: 'bg-purple-light text-purple-base',
    swatch: 'bg-purple-base',
    text: 'text-purple-base',
  },
  pink: {
    tag: 'bg-pink-light text-pink-dark',
    icon: 'bg-pink-light text-pink-base',
    swatch: 'bg-pink-base',
    text: 'text-pink-base',
  },
  red: {
    tag: 'bg-red-light text-red-dark',
    icon: 'bg-red-light text-red-base',
    swatch: 'bg-red-base',
    text: 'text-red-base',
  },
  orange: {
    tag: 'bg-orange-light text-orange-dark',
    icon: 'bg-orange-light text-orange-base',
    swatch: 'bg-orange-base',
    text: 'text-orange-base',
  },
  yellow: {
    tag: 'bg-yellow-light text-yellow-dark',
    icon: 'bg-yellow-light text-yellow-base',
    swatch: 'bg-yellow-base',
    text: 'text-yellow-base',
  },
}

/** Neutral style for unknown colors (the "Gray" tag in the Figma layout). */
const neutralClasses: ColorClasses = {
  tag: 'bg-gray-200 text-gray-700',
  icon: 'bg-gray-200 text-gray-700',
  swatch: 'bg-gray-400',
  text: 'text-gray-700',
}

export function isCategoryColor(value: string): value is CategoryColor {
  return (CATEGORY_COLORS as readonly string[]).includes(value)
}

export function getCategoryColorClasses(color: string): ColorClasses {
  return isCategoryColor(color) ? colorClasses[color] : neutralClasses
}
