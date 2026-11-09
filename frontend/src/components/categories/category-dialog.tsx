import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { CreateCategoryMutation, UpdateCategoryMutation } from '@/api/categories'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { TextField } from '@/components/ui/text-field'
import type { CategoryFieldsFragment } from '@/gql/graphql'
import { invalidateFinanceData } from '@/lib/cache'
import { CATEGORY_COLORS } from '@/lib/category-colors'
import { CATEGORY_ICON_NAMES } from '@/lib/category-icons'
import { getErrorMessage } from '@/lib/errors'

import { ColorPicker, IconPicker } from './category-pickers'

const categorySchema = z.object({
  title: z.string().trim().min(1, 'Informe o título').max(50, 'Use no máximo 50 caracteres'),
  description: z.string().trim().max(200, 'Use no máximo 200 caracteres'),
  icon: z.enum(CATEGORY_ICON_NAMES as [string, ...string[]], { error: 'Selecione um ícone' }),
  color: z.enum(CATEGORY_COLORS, { error: 'Selecione uma cor' }),
})

type CategoryForm = z.infer<typeof categorySchema>

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Category being edited; omitted to create a new one */
  category?: CategoryFieldsFragment
}

/** "Nova categoria" / edit form in a dialog. */
export function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader
          title={category ? 'Editar categoria' : 'Nova categoria'}
          description={
            category ? 'Atualize os dados da categoria' : 'Organize suas transações com categorias'
          }
        />
        <CategoryFormContent category={category} onSaved={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function CategoryFormContent({
  category,
  onSaved,
}: {
  category?: CategoryFieldsFragment
  onSaved: () => void
}) {
  const [createCategory] = useMutation(CreateCategoryMutation, { update: invalidateFinanceData })
  const [updateCategory] = useMutation(UpdateCategoryMutation, { update: invalidateFinanceData })
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: category?.title ?? '',
      description: category?.description ?? '',
      icon: category?.icon ?? CATEGORY_ICON_NAMES[0],
      color: (category?.color as CategoryForm['color']) ?? CATEGORY_COLORS[0],
    },
  })

  async function onSubmit(input: CategoryForm) {
    try {
      if (category) {
        await updateCategory({ variables: { id: category.id, input } })
        toast.success('Categoria atualizada')
      } else {
        await createCategory({ variables: { input } })
        toast.success('Categoria criada')
      }
      onSaved()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <TextField
          label="Título"
          placeholder="Ex. Alimentação"
          error={errors.title?.message}
          {...register('title')}
        />
        <TextField
          label="Descrição"
          placeholder="Descrição da categoria"
          helper="Opcional"
          error={errors.description?.message}
          {...register('description')}
        />
        <Controller
          control={control}
          name="icon"
          render={({ field }) => (
            <IconPicker
              value={field.value}
              onChange={field.onChange}
              error={errors.icon?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="color"
          render={({ field }) => (
            <ColorPicker
              value={field.value}
              onChange={field.onChange}
              error={errors.color?.message}
            />
          )}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando…' : 'Salvar'}
      </Button>
    </form>
  )
}
