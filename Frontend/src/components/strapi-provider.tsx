import React, { useEffect, useRef } from 'react';
import { useUI } from '@contexts/ui.context';

export const StrapiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { authorize, unauthorize } = useUI();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/current-user', {
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user && mounted.current) {
            authorize();
          } else if (mounted.current) {
            unauthorize();
          }
        } else if (mounted.current) {
          unauthorize();
        }
      } catch {
        if (mounted.current) {
          unauthorize();
        }
      }
    };

    checkAuth();

    return () => {
      mounted.current = false;
    };
  }, [authorize, unauthorize]);

  return <>{children}</>;
};
