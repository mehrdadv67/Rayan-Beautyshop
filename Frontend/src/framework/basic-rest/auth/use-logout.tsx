import { useUI } from '@contexts/ui.context'
import Router from 'next/router'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

async function logout() {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Logout failed')
  }

  return res.json()
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
      toast.error('خطا در خروج. لطفا دوباره تلاش کنید.')
    },
  })
}
