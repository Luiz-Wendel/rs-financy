import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'rounded-xl! border-gray-200! font-sans! text-sm!',
          title: 'text-gray-800!',
          description: 'text-gray-600!',
        },
      }}
    />
  )
}
