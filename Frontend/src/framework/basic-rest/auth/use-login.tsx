import { useUI } from '@contexts/ui.context'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/router'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export interface LoginInputType {
  email: string
  password: string
  remember_me: boolean
}

async function login(input: LoginInputType) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  })
  if (error) {
    throw error
  }
  return data
}

export const useLoginMutation = () => {
  const { authorize, closeModal } = useUI()
  const router = useRouter()

  return useMutation({
    mutationFn: (input: LoginInputType) => login(input),
    onSuccess: () => {
      authorize()
      closeModal()
      const redirectTo =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('redirectTo')
          : null
      router.push(redirectTo || '/my-account')
      toast.success('با موفقیت وارد شدید')
    },
    onError: (error: any) => {
      const message =
        error?.message || 'خطا در ورود. لطفا دوباره تلاش کنید.'
      toast.error(message)
    },
  })
}
