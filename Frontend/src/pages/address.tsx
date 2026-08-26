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

export default function AddressPage() {
	const { t } = useTranslation("common");
	return (
		<>
			<NextSeo
				title={`${t('text-page-address')} | ${siteSettings.name}`}
				description={siteSettings.description}
				canonical={absoluteSiteUrl('/address')}
			/>
			<PageHeader pageHeader="text-page-address" />
			<Container>
				<div className="py-16 lg:py-20">
					<p className="text-center text-body">{t('text-address-empty', 'آدرس ذخیره شده‌ای وجود ندارد.')}</p>
				</div>
				<Subscription />
			</Container>
		</>
	);
}

AddressPage.Layout = Layout;

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
