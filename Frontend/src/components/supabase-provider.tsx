import React, { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUI } from '@/contexts/ui.context'

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { authorize, unauthorize } = useUI()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        authorize()
      } else {
        unauthorize()
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        authorize()
      } else {
        unauthorize()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [authorize, unauthorize])

  return <>{children}</>
}
