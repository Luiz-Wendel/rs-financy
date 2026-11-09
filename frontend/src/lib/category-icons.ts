import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  type LucideIcon,
  Mailbox,
  PawPrint,
  PiggyBank,
  ReceiptText,
  ShoppingCart,
  Tag,
  Ticket,
  ToolCase,
  Utensils,
} from 'lucide-react'

/** Icons accepted by the API, in the order of the icon picker in the Figma layout. */
export const CATEGORY_ICONS = {
  'briefcase-business': BriefcaseBusiness,
  'car-front': CarFront,
  'heart-pulse': HeartPulse,
  'piggy-bank': PiggyBank,
  'shopping-cart': ShoppingCart,
  ticket: Ticket,
  'tool-case': ToolCase,
  utensils: Utensils,
  'paw-print': PawPrint,
  house: House,
  gift: Gift,
  dumbbell: Dumbbell,
  'book-open': BookOpen,
  'baggage-claim': BaggageClaim,
  mailbox: Mailbox,
  'receipt-text': ReceiptText,
} satisfies Record<string, LucideIcon>

export type CategoryIconName = keyof typeof CATEGORY_ICONS

export const CATEGORY_ICON_NAMES = Object.keys(CATEGORY_ICONS) as CategoryIconName[]

export function getCategoryIcon(name: string): LucideIcon {
  return CATEGORY_ICONS[name as CategoryIconName] ?? Tag
}

/** Accessible names of the icons in the picker. */
export const CATEGORY_ICON_LABELS: Record<CategoryIconName, string> = {
  'briefcase-business': 'Trabalho',
  'car-front': 'Carro',
  'heart-pulse': 'Saúde',
  'piggy-bank': 'Investimento',
  'shopping-cart': 'Compras',
  ticket: 'Entretenimento',
  'tool-case': 'Ferramentas',
  utensils: 'Alimentação',
  'paw-print': 'Pets',
  house: 'Casa',
  gift: 'Presentes',
  dumbbell: 'Academia',
  'book-open': 'Educação',
  'baggage-claim': 'Viagem',
  mailbox: 'Correspondência',
  'receipt-text': 'Contas',
}
