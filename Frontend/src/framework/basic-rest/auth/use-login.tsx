import { useUI } from '@contexts/ui.context'
import { useRouter } from 'next/router'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export interface LoginInputType {
  email: string
  password: string
  remember_me: boolean
}

async function login(input: LoginInputType) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: input.email, password: input.password }),
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Login failed')
  }

  return res.json()
}

export const useLoginMutation = () => {
  const { authorize, closeModal } = useUI()
  const router = useRouter()

  return useMutation({
    mutationFn: (input: LoginInputType) => login(input),
    onSuccess: () => {
      authorize()
      closeModal()
      const raw =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('redirectTo')
          : null
      const redirectTo =
        raw && /^\/[^/]/.test(raw) ? raw : '/my-account'
      router.push(redirectTo)
      toast.success('با موفقیت وارد شدید')
    },
    onError: (error: any) => {
      const message =
        error?.message || 'خطا در ورود. لطفا دوباره تلاش کنید.'
      toast.error(message)
    },
  })
}
