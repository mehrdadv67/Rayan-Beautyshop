import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import ResetPasswordForm from "@components/auth/reset-password-form";
import PageHeader from "@components/ui/page-header";
import Subscription from "@components/common/subscription";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { NextSeo } from "next-seo";
import { siteSettings } from "@settings/site-settings";
import { absoluteSiteUrl } from "@utils/site-url";

export default function ResetPasswordPage() {
  const { t } = useTranslation("common");
  return (
    <>
      <NextSeo
        title={`${t('text-page-forgot-password')} | ${siteSettings.name}`}
        description={siteSettings.description}
        canonical={absoluteSiteUrl('/auth/reset-password')}
      />
      <PageHeader pageHeader={t('common:text-page-forgot-password-header')} />
      <Container>
        <div className="py-16 lg:py-20">
          <ResetPasswordForm />
        </div>
        <Subscription />
      </Container>
    </>
  );
}

ResetPasswordPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        "common",
        "forms",
        "menu",
        "footer",
      ])),
    },
  };
};
