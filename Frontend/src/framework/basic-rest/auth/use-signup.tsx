import { useUI } from '@contexts/ui.context'
import { useRouter } from 'next/router'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export interface SignUpInputType {
  username: string
  email: string
  password: string
  confirmPassword: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  address?: string

  city?: string
  zipCode?: string
  gender?: string
}

async function signUp(input: SignUpInputType) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: input.username,
      email: input.email,
      password: input.password,
    }),
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Signup failed')
  }

  return res.json()
}

export const useSignUpMutation = () => {
  const { authorize, closeModal } = useUI()
  const router = useRouter()

  return useMutation({
    mutationFn: (input: SignUpInputType) => signUp(input),
    onSuccess: (data) => {
      authorize()
      closeModal()
      if (data?.requiresConfirmation) {
        toast.success('ثبت نام موفق! لطفا ایمیل خود را بررسی کنید.')
        router.push('/signin')
      } else if (data?.user) {
        toast.success('ثبت نام موفق!')
        router.push('/my-account')
      }
    },
    onError: (error: any) => {
      const message =
        error?.message || 'خطا در ثبت نام. لطفا دوباره تلاش کنید.'
      toast.error(message)
    },
  })
}
