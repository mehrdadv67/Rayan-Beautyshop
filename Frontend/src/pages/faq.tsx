import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Subscription from "@components/common/subscription";
import Accordion from "@components/common/accordion";
import PageHeader from "@components/ui/page-header";
import { faq } from "@settings/faq.settings";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

interface FAQProps {
  bannerImage?: string;
}

export default function FAQ({ bannerImage }: FAQProps) {
 	return (
 		<>
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
      `${process.env.STRAPI_URL || "http://localhost:1337"}/api/banners?filters[position][$eq]=faq&populate=image`,
      {
        headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
        next: { revalidate: 3600 },
      }
    );
    const data = await res.json();
    const banners = data.data || [];
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
