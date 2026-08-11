import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import ResetPasswordForm from "@components/auth/reset-password-form";
import PageHeader from "@components/ui/page-header";
import Subscription from "@components/common/subscription";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

export default function ResetPasswordPage() {
  return (
    <>
      <PageHeader pageHeader="فراموشی رمز عبور" />
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
