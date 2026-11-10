import { Mail, Plus, Search, SquarePen, Trash, UserRound, UserRoundPlus } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { toast } from 'sonner'

import { CategoryIcon } from '@/components/categories/category-icon'
import { ColorPicker, IconPicker } from '@/components/categories/category-pickers'
import { Logo } from '@/components/logo'
import { PageTitle } from '@/components/page-title'
import { TransactionAmount } from '@/components/transactions/transaction-amount'
import { TransactionTypeIndicator } from '@/components/transactions/transaction-type'
import { TransactionTypeToggle } from '@/components/transactions/transaction-type-toggle'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { CurrencyField } from '@/components/ui/currency-field'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { Divider } from '@/components/ui/divider'
import { Pagination } from '@/components/ui/pagination'
import { PasswordField } from '@/components/ui/password-field'
import { SelectField } from '@/components/ui/select-field'
import { Skeleton } from '@/components/ui/skeleton'
import { Tag } from '@/components/ui/tag'
import { TextField } from '@/components/ui/text-field'
import { TextLink } from '@/components/ui/text-link'
import type { TransactionType } from '@/gql/graphql'
import { CATEGORY_COLOR_LABELS, CATEGORY_COLORS } from '@/lib/category-colors'
import { CATEGORY_ICON_NAMES } from '@/lib/category-icons'

/*
 * Visual documentation of the Figma Style Guide, available only in development (/style-guide).
 * Class names are written in full so Tailwind generates them.
 */

const colorGroups = [
  {
    title: 'Brand',
    colors: [
      { name: 'brand-base', className: 'bg-brand-base' },
      { name: 'brand-dark', className: 'bg-brand-dark' },
    ],
  },
  {
    title: 'Grayscale',
    colors: [
      { name: 'gray-100', className: 'bg-gray-100' },
      { name: 'gray-200', className: 'bg-gray-200' },
      { name: 'gray-300', className: 'bg-gray-300' },
      { name: 'gray-400', className: 'bg-gray-400' },
      { name: 'gray-500', className: 'bg-gray-500' },
      { name: 'gray-600', className: 'bg-gray-600' },
      { name: 'gray-700', className: 'bg-gray-700' },
      { name: 'gray-800', className: 'bg-gray-800' },
    ],
  },
  {
    title: 'Feedback',
    colors: [
      { name: 'danger', className: 'bg-danger' },
      { name: 'success', className: 'bg-success' },
    ],
  },
  {
    title: 'Categorias',
    colors: [
      { name: 'green-dark', className: 'bg-green-dark' },
      { name: 'green-base', className: 'bg-green-base' },
      { name: 'green-light', className: 'bg-green-light' },
      { name: 'blue-dark', className: 'bg-blue-dark' },
      { name: 'blue-base', className: 'bg-blue-base' },
      { name: 'blue-light', className: 'bg-blue-light' },
      { name: 'purple-dark', className: 'bg-purple-dark' },
      { name: 'purple-base', className: 'bg-purple-base' },
      { name: 'purple-light', className: 'bg-purple-light' },
      { name: 'pink-dark', className: 'bg-pink-dark' },
      { name: 'pink-base', className: 'bg-pink-base' },
      { name: 'pink-light', className: 'bg-pink-light' },
      { name: 'red-dark', className: 'bg-red-dark' },
      { name: 'red-base', className: 'bg-red-base' },
      { name: 'red-light', className: 'bg-red-light' },
      { name: 'orange-dark', className: 'bg-orange-dark' },
      { name: 'orange-base', className: 'bg-orange-base' },
      { name: 'orange-light', className: 'bg-orange-light' },
      { name: 'yellow-dark', className: 'bg-yellow-dark' },
      { name: 'yellow-base', className: 'bg-yellow-base' },
      { name: 'yellow-light', className: 'bg-yellow-light' },
    ],
  },
]

const typeScale = [
  { name: 'text-display', size: '28px / 32px', className: 'text-display font-bold' },
  { name: 'text-2xl', size: '24px / 32px', className: 'text-2xl font-bold' },
  { name: 'text-xl', size: '20px / 28px', className: 'text-xl font-bold' },
  { name: 'text-base', size: '16px / 24px', className: 'text-base' },
  { name: 'text-sm', size: '14px / 20px', className: 'text-sm' },
  { name: 'text-xs', size: '12px / 16px', className: 'text-xs' },
]

const selectOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'INCOME', label: 'Entrada' },
  { value: 'EXPENSE', label: 'Saída' },
]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <Card className="flex flex-col gap-6 p-6">{children}</Card>
    </section>
  )
}

function Example({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-medium tracking-wider text-gray-500 uppercase">{label}</h3>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  )
}

export function StyleGuidePage() {
  const [type, setType] = useState<TransactionType>('EXPENSE')
  const [amount, setAmount] = useState(8950)
  const [select, setSelect] = useState('all')
  const [icon, setIcon] = useState<string>(CATEGORY_ICON_NAMES[0])
  const [color, setColor] = useState<string>(CATEGORY_COLORS[0])
  const [page, setPage] = useState(2)

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12">
      <PageTitle>Style Guide</PageTitle>
      <header className="flex flex-col items-start gap-4">
        <Logo />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Style Guide</h1>
          <p className="text-base text-gray-600">
            Tokens e componentes do Financy, conforme o Figma. Disponível apenas em desenvolvimento.
          </p>
        </div>
      </header>

      <Section title="Cores">
        {colorGroups.map((group) => (
          <Example key={group.title} label={group.title}>
            {group.colors.map(({ name, className }) => (
              <div key={name} className="flex w-24 flex-col gap-2">
                <span className={`h-12 rounded-lg border border-gray-200 ${className}`} />
                <code className="text-xs text-gray-600">{name}</code>
              </div>
            ))}
          </Example>
        ))}
      </Section>

      <Section title="Tipografia">
        <p className="text-sm text-gray-600">Fonte Inter. Escala usada no layout:</p>
        <div className="flex flex-col gap-3">
          {typeScale.map(({ name, size, className }) => (
            <div key={name} className="flex items-baseline gap-6">
              <code className="w-28 shrink-0 text-xs text-gray-500">{name}</code>
              <span className="w-24 shrink-0 text-xs text-gray-500">{size}</span>
              <span className={`text-gray-800 ${className}`}>Organize suas finanças</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Botões">
        <Example label="Label Button · md">
          <Button>
            <UserRoundPlus />
            Solid
          </Button>
          <Button variant="outline">
            <UserRoundPlus />
            Outline
          </Button>
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>
            Disabled
          </Button>
        </Example>
        <Example label="Label Button · sm">
          <Button size="sm">
            <Plus />
            Nova transação
          </Button>
          <Button size="sm" variant="outline">
            Cancelar
          </Button>
          <Button size="sm" variant="danger">
            Excluir
          </Button>
        </Example>
        <Example label="Icon Button">
          <Button variant="outline" size="icon" aria-label="Editar">
            <SquarePen />
          </Button>
          <Button variant="danger" size="icon" aria-label="Excluir">
            <Trash />
          </Button>
          <Button variant="outline" size="icon" aria-label="Editar (desabilitado)" disabled>
            <SquarePen />
          </Button>
        </Example>
        <Example label="Link">
          <TextLink href="#links">Ver todas</TextLink>
          <TextLink asChild>
            <button type="button">Recuperar senha</button>
          </TextLink>
        </Example>
      </Section>

      <Section title="Campos">
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField label="Vazio" icon={Mail} placeholder="mail@exemplo.com" />
          <TextField label="Preenchido" icon={UserRound} defaultValue="Conta Teste" />
          <TextField label="Com erro" icon={Mail} defaultValue="conta@" error="E-mail inválido" />
          <TextField label="Desabilitado" icon={Mail} defaultValue="conta@teste.com" disabled />
          <TextField
            label="Somente leitura"
            icon={Mail}
            value="conta@teste.com"
            readOnly
            helper="O e-mail não pode ser alterado"
          />
          <TextField label="Busca" icon={Search} type="search" placeholder="Buscar por descrição" />
          <PasswordField
            label="Senha"
            placeholder="Digite sua senha"
            helper="Mínimo 8 caracteres"
          />
          <CurrencyField label="Valor" value={amount} onChange={setAmount} />
          <SelectField
            label="Select"
            options={selectOptions}
            value={select}
            onValueChange={setSelect}
          />
          <SelectField label="Select sem valor" options={selectOptions} placeholder="Selecione" />
        </div>
        <Checkbox label="Lembrar-me" />
      </Section>

      <Section title="Tags e tipos">
        <Example label="Tag">
          {CATEGORY_COLORS.map((tagColor) => (
            <Tag key={tagColor} color={tagColor}>
              {CATEGORY_COLOR_LABELS[tagColor]}
            </Tag>
          ))}
          <Tag>Cinza</Tag>
        </Example>
        <Example label="Type">
          <TransactionTypeIndicator type="INCOME" />
          <TransactionTypeIndicator type="EXPENSE" />
          <TransactionAmount type="INCOME" amount={425000} />
          <TransactionAmount type="EXPENSE" amount={8950} />
        </Example>
        <Example label="Seletor de tipo">
          <div className="w-full max-w-100">
            <TransactionTypeToggle value={type} onChange={setType} />
          </div>
        </Example>
      </Section>

      <Section title="Categorias">
        <Example label="Ícones">
          {CATEGORY_ICON_NAMES.map((name, index) => (
            <CategoryIcon
              key={name}
              icon={name}
              color={CATEGORY_COLORS[index % CATEGORY_COLORS.length]!}
            />
          ))}
        </Example>
        <div className="grid max-w-100 gap-4">
          <IconPicker value={icon} onChange={setIcon} />
          <ColorPicker value={color} onChange={setColor} />
        </div>
      </Section>

      <Section title="Outros">
        <Example label="Avatar">
          <Avatar name="Conta Teste" />
          <Avatar name="Conta Teste" size="lg" />
        </Example>
        <Example label="Paginação">
          <Pagination
            className="w-full"
            page={page}
            perPage={10}
            total={27}
            totalPages={3}
            onPageChange={setPage}
          />
        </Example>
        <Example label="Divisor">
          <div className="w-full max-w-100">
            <Divider label="ou" />
          </div>
        </Example>
        <Example label="Carregando">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </Example>
        <Example label="Dialog e toasts">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Abrir dialog
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader
                title="Nova categoria"
                description="Organize suas transações com categorias"
              />
              <TextField label="Título" placeholder="Ex. Alimentação" />
              <Button>Salvar</Button>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={() => toast.success('Transação criada')}>
            Toast de sucesso
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.error('E-mail ou senha inválidos')}
          >
            Toast de erro
          </Button>
        </Example>
      </Section>
    </main>
  )
}
