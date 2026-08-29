import Layout from "@components/layout/layout";
import AccountLayout from "@components/my-account/account-layout";
import OrdersTable from "@components/my-account/orders-table";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import { siteSettings } from "@settings/site-settings";
import { absoluteSiteUrl } from "@utils/site-url";

export default function OrdersTablePage() {
  return (
    <AccountLayout>
      <NextSeo
        title={`${siteSettings.name}`}
        description={siteSettings.description}
        canonical={absoluteSiteUrl('/my-account/orders')}
      />
      <OrdersTable />
		</AccountLayout>
	);
}

OrdersTablePage.Layout = Layout;

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
