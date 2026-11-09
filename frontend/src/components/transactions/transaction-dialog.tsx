import { useMutation, useQuery } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { CategoriesQuery } from '@/api/categories'
import { CreateTransactionMutation, UpdateTransactionMutation } from '@/api/transactions'
import { Button } from '@/components/ui/button'
import { CurrencyField } from '@/components/ui/currency-field'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { SelectField } from '@/components/ui/select-field'
import { TextField } from '@/components/ui/text-field'
import type { TransactionFieldsFragment } from '@/gql/graphql'
import { invalidateFinanceData } from '@/lib/cache'
import { MAX_AMOUNT_IN_CENTS } from '@/lib/currency-input'
import { getErrorMessage } from '@/lib/errors'

import { TransactionTypeToggle } from './transaction-type-toggle'

const transactionSchema = z.object({
  type: z.enum(['EXPENSE', 'INCOME']),
  description: z
    .string()
    .trim()
    .min(1, 'Informe a descrição')
    .max(100, 'Use no máximo 100 caracteres'),
  date: z.iso.date('Informe a data'),
  amount: z
    .number()
    .int()
    .positive('Informe um valor maior que zero')
    .max(MAX_AMOUNT_IN_CENTS, 'O valor máximo é R$ 1.000.000.000,00'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
})

type TransactionForm = z.infer<typeof transactionSchema>

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Transaction being edited; omitted to create a new one */
  transaction?: TransactionFieldsFragment
}

/** "Nova transação" / edit form in a dialog. */
export function TransactionDialog({ open, onOpenChange, transaction }: TransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader
          title={transaction ? 'Editar transação' : 'Nova transação'}
          description={
            transaction ? 'Atualize os dados da transação' : 'Registre sua despesa ou receita'
          }
        />
        {/* The form is mounted only while open, so it always starts with fresh values */}
        <TransactionFormContent transaction={transaction} onSaved={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function TransactionFormContent({
  transaction,
  onSaved,
}: {
  transaction?: TransactionFieldsFragment
  onSaved: () => void
}) {
  const { data } = useQuery(CategoriesQuery)
  const categories = data?.categories ?? []
  const [createTransaction] = useMutation(CreateTransactionMutation, {
    update: invalidateFinanceData,
  })
  const [updateTransaction] = useMutation(UpdateTransactionMutation, {
    update: invalidateFinanceData,
  })
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: transaction?.type ?? 'EXPENSE',
      description: transaction?.description ?? '',
      date: transaction?.date ?? '',
      amount: transaction?.amount ?? 0,
      categoryId: transaction?.category.id ?? '',
    },
  })

  async function onSubmit(input: TransactionForm) {
    try {
      if (transaction) {
        await updateTransaction({ variables: { id: transaction.id, input } })
        toast.success('Transação atualizada')
      } else {
        await createTransaction({ variables: { input } })
        toast.success('Transação criada')
      }
      onSaved()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <TransactionTypeToggle value={field.value} onChange={field.onChange} />
        )}
      />

      <div className="flex flex-col gap-4">
        <TextField
          label="Descrição"
          placeholder="Ex. Almoço no restaurante"
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Data" type="date" error={errors.date?.message} {...register('date')} />
          <Controller
            control={control}
            name="amount"
            render={({ field }) => (
              <CurrencyField
                label="Valor"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                error={errors.amount?.message}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <SelectField
              label="Categoria"
              placeholder="Selecione"
              options={categories.map((category) => ({
                value: category.id,
                label: category.title,
              }))}
              value={field.value}
              onValueChange={field.onChange}
              helper={
                data && categories.length === 0
                  ? 'Crie uma categoria antes de registrar transações'
                  : undefined
              }
              error={errors.categoryId?.message}
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
