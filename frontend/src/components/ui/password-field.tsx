import { Eye, EyeClosed, Lock } from 'lucide-react'
import { useState } from 'react'

import { TextField, type TextFieldProps } from './text-field'

type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'endAdornment'>

/** Password input with the lock icon and a show/hide toggle (eye icons from the Style Guide). */
export function PasswordField({ icon = Lock, ...props }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ToggleIcon = isVisible ? EyeClosed : Eye

  return (
    <TextField
      {...props}
      icon={icon}
      type={isVisible ? 'text' : 'password'}
      endAdornment={
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={isVisible}
          disabled={props.disabled}
          className="shrink-0 rounded text-gray-700 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <ToggleIcon aria-hidden className="size-4" />
        </button>
      }
    />
  )
}
