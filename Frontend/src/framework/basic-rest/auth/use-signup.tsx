import { useUI } from '@contexts/ui.context'
import { createClient } from '@/lib/supabase/client'
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
  const supabase = createClient()

  const { data: signUpData, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        first_name: input.firstName || '',
        last_name: input.lastName || '',
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    throw error
  }

  if (signUpData.user) {
    try {
      await supabase.from('profiles').upsert({
        id: signUpData.user.id,
        first_name: input.firstName || '',
        last_name: input.lastName || '',
        phone_number: input.phoneNumber || '',
        address: input.address || '',
        city: input.city || '',
        zip_code: input.zipCode || '',
        gender: input.gender || '',
      })
    } catch (profileError) {
      console.warn('Profile creation failed:', profileError)
    }
  }

  return signUpData
}

export const useSignUpMutation = () => {
  const { authorize, closeModal } = useUI()
  const router = useRouter()

  return useMutation({
    mutationFn: (input: SignUpInputType) => signUp(input),
    onSuccess: (data) => {
      authorize()
      closeModal()
      if (data?.user) {
        toast.success('ثبت نام موفق! لطفا ایمیل خود را بررسی کنید.')
      }
      router.push('/signin')
    },
    onError: (error: any) => {
      const message =
        error?.message || 'خطا در ثبت نام. لطفا دوباره تلاش کنید.'
      toast.error(message)
    },
  })
}
