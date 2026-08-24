import { DefaultSeo as NextDefaultSeo } from "next-seo";
import Head from "next/head";
import { siteSettings } from "@settings/site-settings";
import { absoluteSiteUrl } from "@utils/site-url";
import { organizationJsonLd } from "@utils/json-ld";

export const DefaultSeo = () => {
  const baseUrl = absoluteSiteUrl("/");
  const locales = ["en", "de", "es", "ar", "he", "zh", "fa"];

  const organizationLd = organizationJsonLd({
    name: siteSettings.name,
    url: baseUrl,
    description: siteSettings.description,
    logo: typeof siteSettings.logo === 'string' ? siteSettings.logo : siteSettings.logo?.url,
    contactPoint: {
      contactType: "customer service",
      email: "info@rayan-beauty.com",
    },
  });

  const linkTags: Array<{
    rel: string;
    href: string;
    hrefLang?: string;
  }> = [
    {
      rel: "apple-touch-icon",
      href: "icons/apple-icon-180.png",
    },
    {
      rel: "manifest",
      href: "/manifest.json",
    },
    ...locales.map((locale) => ({
      rel: "alternate",
      hrefLang: locale,
      href: `${baseUrl}${locale}/`,
    })),
    {
      rel: "alternate",
      hrefLang: "x-default",
      href: baseUrl,
    },
  ];

  return (
    <>
      <NextDefaultSeo
        title={siteSettings.name}
        description={siteSettings.description}
        canonical={baseUrl}
        openGraph={{
          type: "website",
          locale: "fa_IR",
          site_name: siteSettings.name,
          url: baseUrl,
          title: siteSettings.name,
          description: siteSettings.description,
          images: [
            {
              url: "/assets/images/og-image-01.png",
              width: 800,
              height: 600,
              alt: siteSettings.name,
            },
          ],
        }}
        twitter={{
          handle: "@rayan_official",
          site: "@rayan_official",
          cardType: "summary_large_image",
        }}
        additionalMetaTags={[
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1 maximum-scale=1",
          },
          {
            name: "apple-mobile-web-app-capable",
            content: "yes",
          },
          {
            name: "theme-color",
            content: "#ffffff",
          },
          {
            name: "robots",
            content: "index, follow",
          },
          {
            name: "author",
            content: siteSettings.name,
          },
        ]}
        additionalLinkTags={linkTags}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
      </Head>
    </>
  );
};
