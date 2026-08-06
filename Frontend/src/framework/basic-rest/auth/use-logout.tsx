import { useUI } from '@contexts/ui.context'
import { createClient } from '@/lib/supabase/client'
import Router from 'next/router'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

async function logout() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
  return { ok: true, message: 'Logout successful' }
}

export const useLogoutMutation = () => {
  const { unauthorize } = useUI()
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      unauthorize()
      toast.success('با موفقیت خارج شدید')
      Router.push('/')
    },
    onError: (error: any) => {
      toast.error('خطا در خروج. لطفا دوباره تلاش کنید.');
    },
  })
}
