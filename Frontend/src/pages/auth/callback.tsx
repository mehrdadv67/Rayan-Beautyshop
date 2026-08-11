import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUI } from '@contexts/ui.context';

const AuthCallback: React.FC = () => {
  const router = useRouter();
  const { authorize } = useUI();
  const { next } = router.query;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/current-user', {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.user) {
          authorize();
          router.push(typeof next === 'string' ? next : '/my-account');
        } else {
          router.push('/signin');
        }
      } catch {
        router.push('/signin');
      }
    };

    checkAuth();
  }, [router, authorize, next]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-heading">در حال تایید حساب کاربری...</p>
    </div>
  );
};

export default AuthCallback;
