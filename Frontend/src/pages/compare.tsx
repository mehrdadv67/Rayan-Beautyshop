import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Subscription from "@components/common/subscription";
import PageHeader from "@components/ui/page-header";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { NextSeo } from "next-seo";
import { siteSettings } from "@settings/site-settings";
import { absoluteSiteUrl } from "@utils/site-url";

export default function ComparePage() {
	const { t } = useTranslation("common");
	return (
		<>
			<NextSeo
				title={`${t('text-page-compare')} | ${siteSettings.name}`}
				description={siteSettings.description}
				canonical={absoluteSiteUrl('/compare')}
			/>
			<PageHeader pageHeader="text-page-compare" />
			<Container>
				<div className="py-16 lg:py-20">
					<p className="text-center text-body">{t('text-compare-empty', 'لیست مقایسه شما خالی است.')}</p>
				</div>
				<Subscription />
			</Container>
		</>
	);
}

ComparePage.Layout = Layout;

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
