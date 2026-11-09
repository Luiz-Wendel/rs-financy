import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogHeader } from '@/components/ui/dialog'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  isConfirming?: boolean
}

/** Asks for confirmation before destructive actions (e.g. deleting). */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  isConfirming = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent role="alertdialog">
        <DialogHeader title={title} description={description} />
        <div className="flex justify-end gap-3">
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Cancelar
            </Button>
          </DialogClose>
          <Button variant="danger" size="sm" onClick={onConfirm} disabled={isConfirming}>
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
