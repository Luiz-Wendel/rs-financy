import { LoaderCircle } from 'lucide-react'

export function FullScreenLoader() {
  return (
    <div className="flex min-h-dvh items-center justify-center" role="status">
      <LoaderCircle aria-hidden className="size-8 animate-spin text-brand-base" />
      <span className="sr-only">Carregando…</span>
    </div>
  )
}
