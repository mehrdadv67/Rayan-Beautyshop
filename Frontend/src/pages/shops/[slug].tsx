import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Subscription from "@components/common/subscription";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import ShopsSingleDetails from "@components/shops/shops-single-details";
import { NextSeo } from "next-seo";
import { siteSettings } from "@settings/site-settings";
import { absoluteSiteUrl } from "@utils/site-url";

export default function ShopDetailsPage() {
	return (
		<div className="border-t border-gray-300">
			<NextSeo
				title={siteSettings.name}
				description={siteSettings.description}
				canonical={absoluteSiteUrl('/shops/[slug]')}
			/>
			<ShopsSingleDetails />
			<Container>
				<Subscription />
			</Container>
		</div>
	);
}

ShopDetailsPage.Layout = Layout;

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
