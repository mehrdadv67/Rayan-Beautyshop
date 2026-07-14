import nextPWA from 'next-pwa';
import runtimeCache from 'next-pwa/cache';
import { i18n } from './next-i18next.config';

const withPWA = nextPWA({
  dest: 'public',
  disable: process.env.NODE_ENV !== 'production',
  runtimeCaching: runtimeCache,
});

export default withPWA({
  i18n,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Allow Strapi (and any configured media host) to be used by next/image.
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
      },
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_STRAPI_URL
          ? new URL(process.env.NEXT_PUBLIC_STRAPI_URL).hostname
          : 'localhost',
      },
    ],
  },
});
