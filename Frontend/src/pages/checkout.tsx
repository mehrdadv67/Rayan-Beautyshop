import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Subscription from "@components/common/subscription";
import PageHeader from "@components/ui/page-header";
import CheckoutForm from "@components/checkout/checkout-form";
import CheckoutCard from "@components/checkout/checkout-card";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { siteSettings } from "@settings/site-settings";
import { absoluteSiteUrl } from "@utils/site-url";
import { useTranslation } from "next-i18next";

interface CheckoutPageProps {
  bannerImage?: string;
}

export default function CheckoutPage({ bannerImage }: CheckoutPageProps) {
  const { t } = useTranslation('common');
  return (
    <>
      <NextSeo
        title={`${t('text-page-checkout')} | ${siteSettings.name}`}
        description={siteSettings.description}
        canonical={absoluteSiteUrl('/checkout')}
      />
      <PageHeader pageHeader="text-page-checkout" backgroundImage={bannerImage} />
      <Container>
        <div className="py-14 xl:py-20 px-0 2xl:max-w-screen-2xl xl:max-w-screen-xl mx-auto flex flex-col md:flex-row w-full">
          <div className="md:w-full lg:w-3/5 flex  h-full flex-col -mt-1.5">
            <CheckoutForm />
          </div>
          <div className="md:w-full lg:w-2/5 ltr:md:ml-7 rtl:md:mr-7 ltr:lg:ml-10 rtl:lg:mr-10 ltr:xl:ml-14 rtl:xl:mr-14 flex flex-col h-full -mt-1.5">
            <CheckoutCard />
          </div>
        </div>
        <Subscription />
      </Container>
    </>
  );
}

CheckoutPage.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let bannerImage: string | null = null;

  try {
    const res = await fetch(
      `${process.env.STRAPI_URL || "http://localhost:1337"}/api/banners?filters[position][$eq]=checkout&populate=image`,
      {
        headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
        cache: "no-store",
      }
    );
    const data = await res.json();
    const banners = data.data || [];
    if (banners.length > 0 && banners[0]?.image?.desktop?.url) {
      bannerImage = banners[0].image.desktop.url;
    }
  } catch (error) {
    console.error('Failed to fetch checkout banner:', error);
  }

  return {
    props: {
      bannerImage,
      ...(await serverSideTranslations(locale!, [
        "common",
        "forms",
        "menu",
        "footer",
      ])),
    },
  };
};
