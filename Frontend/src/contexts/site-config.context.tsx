import React, { createContext, useContext, useEffect } from 'react';
import { useSiteConfigQuery } from '@framework/banner/get-site-config';

type SiteConfigState = {
  logo: { url: string; width: number; height: number };
  favicon: { url: string; width: number; height: number };
  loaded: boolean;
};

const defaultLogo = {
  url: '',
  width: 0,
  height: 0,
};

const SiteConfigContext = createContext<SiteConfigState>({
  logo: defaultLogo,
  favicon: defaultLogo,
  loaded: false,
});

export const useSiteConfig = () => useContext(SiteConfigContext);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, isSuccess } = useSiteConfigQuery();

  // Update the document favicon when a favicon is loaded from Strapi.
  useEffect(() => {
    if (data?.favicon?.url) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = data.favicon.url;
    }
  }, [data?.favicon?.url]);

  return (
    <SiteConfigContext.Provider
      value={{
        logo: data?.logo ?? defaultLogo,
        favicon: data?.favicon ?? defaultLogo,
        loaded: isSuccess,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};
