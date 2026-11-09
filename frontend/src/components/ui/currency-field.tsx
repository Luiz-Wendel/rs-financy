import { formatCurrencyInput, parseCurrencyInput } from '@/lib/currency-input'

import { TextField, type TextFieldProps } from './text-field'

interface CurrencyFieldProps extends Omit<
  TextFieldProps,
  'value' | 'onChange' | 'type' | 'startAdornment' | 'icon'
> {
  /** Value in cents */
  value: number
  onChange: (cents: number) => void
}

/** Brazilian currency input: "R$ 0,00", typed digits fill the value from the cents. */
export function CurrencyField({ value, onChange, ...props }: CurrencyFieldProps) {
  return (
    <TextField
      {...props}
      inputMode="numeric"
      autoComplete="off"
      value={formatCurrencyInput(value)}
      onChange={(event) => onChange(parseCurrencyInput(event.target.value))}
      startAdornment={<span className="text-base text-gray-800">R$</span>}
    />
  )
}
