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
import { ROUTES } from "@utils/routes";
import Link from "@components/ui/link";

export default function OrderConfirmationPage() {
	const { t } = useTranslation("common");
	return (
		<>
			<NextSeo
				title={`${t('text-order-confirmation')} | ${siteSettings.name}`}
				description={siteSettings.description}
				canonical={absoluteSiteUrl('/order-confirmation')}
			/>
			<PageHeader pageHeader="text-order-confirmation" />
			<Container>
				<div className="py-16 lg:py-20 text-center">
					<h2 className="text-2xl font-bold text-heading mb-4">{t('text-order-placed', 'سفارش شما با موفقیت ثبت شد!')}</h2>
					<p className="text-body mb-8">{t('text-order-confirmation-message', 'از خرید شما متشکریم. سفارش شما در حال پردازش است.')}</p>
					<div className="flex justify-center gap-4">
						<Link href={ROUTES.ORDERS} className="px-6 py-3 bg-heading text-white rounded-md hover:bg-gray-600 transition">
							{t('text-view-orders', 'مشاهده سفارشات')}
						</Link>
						<Link href={ROUTES.HOME} className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-100 transition">
							{t('text-continue-shopping')}
						</Link>
					</div>
				</div>
				<Subscription />
			</Container>
		</>
	);
}

OrderConfirmationPage.Layout = Layout;

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
