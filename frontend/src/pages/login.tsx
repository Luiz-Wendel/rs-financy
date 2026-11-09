import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, UserRoundPlus } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'

import { LoginMutation } from '@/api/auth'
import { paths } from '@/app/paths'
import { AuthCard } from '@/components/auth-card'
import { PageTitle } from '@/components/page-title'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Divider } from '@/components/ui/divider'
import { PasswordField } from '@/components/ui/password-field'
import { TextField } from '@/components/ui/text-field'
import { TextLink } from '@/components/ui/text-link'
import { useAuth } from '@/lib/auth/use-auth'
import { getErrorMessage } from '@/lib/errors'

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Informe seu e-mail').pipe(z.email('E-mail inválido')),
  password: z.string().min(1, 'Informe sua senha'),
  remember: z.boolean(),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const { signIn } = useAuth()
  const [login] = useMutation(LoginMutation)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  async function onSubmit({ email, password, remember }: LoginForm) {
    try {
      const { data } = await login({ variables: { input: { email, password } } })
      if (data) signIn(data.login, { remember })
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <>
      <PageTitle>Entrar</PageTitle>
      <AuthCard title="Fazer login" description="Entre na sua conta para continuar">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
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
              autoComplete="current-password"
              placeholder="Digite sua senha"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between gap-4">
              <Controller
                control={control}
                name="remember"
                render={({ field }) => (
                  <Checkbox
                    label="Lembrar-me"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                )}
              />
              <TextLink asChild>
                <button
                  type="button"
                  onClick={() => toast.info('A recuperação de senha estará disponível em breve')}
                >
                  Recuperar senha
                </button>
              </TextLink>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>

        <Divider label="ou" />

        <div className="flex flex-col gap-4">
          <p className="text-center text-sm text-gray-600">Ainda não tem uma conta?</p>
          <Button asChild variant="outline">
            <Link to={paths.signUp}>
              <UserRoundPlus aria-hidden />
              Criar conta
            </Link>
          </Button>
        </div>
      </AuthCard>
    </>
  )
}
