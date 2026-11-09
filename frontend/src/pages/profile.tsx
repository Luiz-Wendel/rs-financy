import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogOut, Mail, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { UpdateProfileMutation } from '@/api/auth'
import { PageTitle } from '@/components/page-title'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TextField } from '@/components/ui/text-field'
import type { AuthUser } from '@/lib/auth/auth-context'
import { useAuth } from '@/lib/auth/use-auth'
import { getErrorMessage } from '@/lib/errors'

const profileSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome').max(100, 'Use no máximo 100 caracteres'),
})

type ProfileForm = z.infer<typeof profileSchema>

export function ProfilePage() {
  const { user, signOut } = useAuth()

  // Private pages only render with a logged user
  if (!user) return null

  return (
    <Card className="mx-auto flex w-full max-w-112 flex-col gap-8 p-6 sm:p-8">
      <PageTitle>Perfil</PageTitle>
      <header className="flex flex-col items-center gap-6 text-center">
        <Avatar name={user.name} size="lg" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="truncate text-xl font-bold text-gray-800">{user.name}</h1>
          <p className="truncate text-base text-gray-500">{user.email}</p>
        </div>
      </header>

      <hr className="border-gray-200" />

      <ProfileFormContent user={user} onSignOut={signOut} />
    </Card>
  )
}

function ProfileFormContent({ user, onSignOut }: { user: AuthUser; onSignOut: () => void }) {
  const [updateProfile] = useMutation(UpdateProfileMutation)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name },
  })

  async function onSubmit(input: ProfileForm) {
    try {
      const { data } = await updateProfile({ variables: { input } })
      // The cache updates the user everywhere (navbar, header); the form starts clean again
      reset({ name: data?.updateProfile.name ?? input.name })
      toast.success('Perfil atualizado')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <TextField
          label="Nome completo"
          icon={UserRound}
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <TextField
          label="E-mail"
          icon={Mail}
          value={user.email}
          readOnly
          helper="O e-mail não pode ser alterado"
        />
      </div>

      <div className="flex flex-col gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando…' : 'Salvar alterações'}
        </Button>
        <Button variant="outline" onClick={onSignOut}>
          <LogOut aria-hidden className="text-danger" />
          Sair da conta
        </Button>
      </div>
    </form>
  )
}
