import Layout from "@components/layout/layout";
import AccountLayout from "@components/my-account/account-layout";
import AccountDetails from "@components/my-account/account-details";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { siteSettings } from "@settings/site-settings";
import { absoluteSiteUrl } from "@utils/site-url";

export default function AccountDetailsPage() {
  return (
    <AccountLayout>
      <NextSeo
        title={`${siteSettings.name}`}
        description={siteSettings.description}
        canonical={absoluteSiteUrl('/my-account/account-details')}
      />
      <AccountDetails />
		</AccountLayout>
	);
}

AccountDetailsPage.Layout = Layout;

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
