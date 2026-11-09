import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn, Mail, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'

import { RegisterMutation } from '@/api/auth'
import { paths } from '@/app/paths'
import { AuthCard } from '@/components/auth-card'
import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { PasswordField } from '@/components/ui/password-field'
import { TextField } from '@/components/ui/text-field'
import { useAuth } from '@/lib/auth/use-auth'
import { getErrorMessage } from '@/lib/errors'

const PASSWORD_HELPER = 'A senha deve ter no mínimo 8 caracteres'

const signUpSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome').max(100, 'Use no máximo 100 caracteres'),
  email: z.string().trim().min(1, 'Informe seu e-mail').pipe(z.email('E-mail inválido')),
  password: z.string().min(8, PASSWORD_HELPER).max(72, 'Use no máximo 72 caracteres'),
})

type SignUpForm = z.infer<typeof signUpSchema>

export function SignUpPage() {
  const { signIn } = useAuth()
  const [registerUser] = useMutation(RegisterMutation)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  async function onSubmit(input: SignUpForm) {
    try {
      const { data } = await registerUser({ variables: { input } })
      if (data) {
        signIn(data.register, { remember: true })
        toast.success('Conta criada com sucesso!')
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <AuthCard title="Criar conta" description="Comece a controlar suas finanças ainda hoje">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <TextField
            label="Nome completo"
            icon={UserRound}
            autoComplete="name"
            placeholder="Seu nome completo"
            error={errors.name?.message}
            {...register('name')}
          />
          <TextField
            label="E-mail"
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder="mail@exemplo.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <PasswordField
            label="Senha"
            autoComplete="new-password"
            placeholder="Digite sua senha"
            helper={PASSWORD_HELPER}
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Cadastrando…' : 'Cadastrar'}
        </Button>
      </form>

      <Divider label="ou" />

      <div className="flex flex-col gap-4">
        <p className="text-center text-sm text-gray-600">Já tem uma conta?</p>
        <Button asChild variant="outline">
          <Link to={paths.home}>
            <LogIn aria-hidden />
            Fazer login
          </Link>
        </Button>
      </div>
    </AuthCard>
  )
}
