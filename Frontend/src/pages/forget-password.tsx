import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import ForgetPasswordForm from "@components/auth/forget-password-form";
import PageHeader from "@components/ui/page-header";
import Subscription from "@components/common/subscription";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { NextSeo } from "next-seo";
import { siteSettings } from "@settings/site-settings";
import { absoluteSiteUrl } from "@utils/site-url";

export default function ForgetPasswordPage() {
	const { t } = useTranslation("common");
	return (
		<>
			<NextSeo
				title={`${t("text-page-forgot-password")} | ${siteSettings.name}`}
				description={siteSettings.description}
				canonical={absoluteSiteUrl('/forget-password')}
			/>
			<PageHeader pageHeader={t("text-page-forgot-password")} />
			<Container>
				<div className="py-16 lg:py-20">
					<ForgetPasswordForm />
				</div>
				<Subscription />
			</Container>
		</>
	);
}

ForgetPasswordPage.Layout = Layout;

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
