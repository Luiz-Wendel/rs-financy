import { RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getErrorMessage } from '@/lib/errors'

/** Shown when a page can't load its data (e.g. the API is offline). */
export function QueryError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <Card role="alert" className="flex flex-col items-center gap-4 px-6 py-12 text-center">
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-gray-800">Não foi possível carregar os dados</p>
        <p className="text-sm text-gray-600">{getErrorMessage(error)}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw aria-hidden />
        Tentar novamente
      </Button>
    </Card>
  )
}
