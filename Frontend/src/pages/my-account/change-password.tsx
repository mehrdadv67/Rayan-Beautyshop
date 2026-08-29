import Layout from "@components/layout/layout";
import AccountLayout from "@components/my-account/account-layout";
import ChangePassword from "@components/my-account/change-password";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import { siteSettings } from "@settings/site-settings";
import { absoluteSiteUrl } from "@utils/site-url";

export default function ChangePasswordPage() {
  return (
    <AccountLayout>
      <NextSeo
        title={`${siteSettings.name}`}
        description={siteSettings.description}
        canonical={absoluteSiteUrl('/my-account/change-password')}
      />
      <ChangePassword />
		</AccountLayout>
	);
}

ChangePasswordPage.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
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
