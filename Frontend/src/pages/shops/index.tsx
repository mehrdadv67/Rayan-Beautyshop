import Layout from "@components/layout/layout";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Container from "@components/ui/container";
import Subscription from "@components/common/subscription";
import ShopsPageContent from "@components/shops/shops-page-content";
import { NextSeo } from "next-seo";
import { siteSettings } from "@settings/site-settings";
import { absoluteSiteUrl } from "@utils/site-url";

export default function ShopsPage() {
	return (
		<>
			<NextSeo
				title={siteSettings.name}
				description={siteSettings.description}
				canonical={absoluteSiteUrl('/shops')}
			/>
			<ShopsPageContent />
			<Container>
				<Subscription />
			</Container>
		</>
	);
}

ShopsPage.Layout = Layout;

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
