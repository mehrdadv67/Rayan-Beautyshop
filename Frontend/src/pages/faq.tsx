import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Subscription from "@components/common/subscription";
import Accordion from "@components/common/accordion";
import PageHeader from "@components/ui/page-header";
import { faq } from "@settings/faq.settings";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { siteSettings } from "@settings/site-settings";
import { absoluteSiteUrl } from "@utils/site-url";
import { strapiBannerParams } from "@framework/utils/api-endpoints";
import { normalizeBanner, unwrapList } from "@framework/utils/normalize";

interface FAQProps {
  bannerImage?: string;
}

export default function FAQ({ bannerImage }: FAQProps) {
  	return (
  		<>
  			<NextSeo
  				title={`${siteSettings.name}`}
  				description={siteSettings.description}
  				canonical={absoluteSiteUrl('/faq')}
  			/>
  			<PageHeader pageHeader="text-page-faq" backgroundImage={bannerImage} />
 			<Container>
 				<div className="py-16 lg:py-20 px-0 max-w-5xl mx-auto space-y-4">
 					<Accordion items={faq} translatorNS="faq" />
 				</div>
 				<Subscription />
 			</Container>
 		</>
 	);
 }

FAQ.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let bannerImage: string | null = null;

  try {
    const res = await fetch(
      `${process.env.STRAPI_URL || "http://localhost:1337"}/api/banners${strapiBannerParams("faq")}`,
      {
        headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch FAQ banner: ${res.status}`);
    }

    const data = await res.json();
    const banners = unwrapList(data, normalizeBanner);
    if (banners.length > 0 && banners[0]?.image?.desktop?.url) {
      bannerImage = banners[0].image.desktop.url;
    }
  } catch (error) {
    console.error('Failed to fetch FAQ banner:', error);
  }

  return {
    props: {
      bannerImage,
      ...(await serverSideTranslations(locale!, [
        "common",
        "forms",
        "menu",
        "faq",
        "footer",
      ])),
    },
  };
};
