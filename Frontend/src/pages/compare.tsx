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
import { useCompare } from "@contexts/compare/compare.context";
import Image from "next/image";
import Link from "@components/ui/link";
import { ROUTES } from "@utils/routes";

export default function ComparePage() {
 	const { t } = useTranslation("common");
 	const { items, isEmpty, removeFromCompare } = useCompare();

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
 					{isEmpty ? (
 						<p className="text-center text-body">{t('text-compare-empty', 'لیست مقایسه شما خالی است.')}</p>
 					) : (
 						<div className="overflow-x-auto">
 							<table className="w-full border-collapse border border-gray-200 min-w-[600px]">
 								<thead>
 									<tr className="bg-gray-100">
 										<th className="p-4 border border-gray-200 text-heading font-semibold">محصول</th>
 										<th className="p-4 border border-gray-200 text-heading font-semibold">قیمت</th>
 										<th className="p-4 border border-gray-200 text-heading font-semibold">توضیحات</th>
 										<th className="p-4 border border-gray-200 text-heading font-semibold">عملیات</th>
 									</tr>
 								</thead>
 								<tbody>
 									{items.map((item) => (
 										<tr key={item.id} className="hover:bg-gray-50">
 											<td className="p-4 border border-gray-200">
 												<div className="flex items-center gap-4">
 													{item.image && (
 														<Image src={item.image} alt={item.name} width={80} height={80} className="object-cover rounded" />
 													)}
 													<span className="font-medium text-heading">{item.name}</span>
 												</div>
 											</td>
 											<td className="p-4 border border-gray-200 text-body">{item.price?.toLocaleString()} تومان</td>
 											<td className="p-4 border border-gray-200 text-body">{item.description || '—'}</td>
 											<td className="p-4 border border-gray-200">
 												<div className="flex gap-2">
 													<Link href={ROUTES.PRODUCT + '/' + item.slug} className="text-sm text-heading hover:underline">
 														مشاهده
 													</Link>
 													<button
 														onClick={() => removeFromCompare(item.id)}
 														className="text-sm text-red-500 hover:underline"
 													>
 														حذف
 													</button>
 												</div>
 											</td>
 										</tr>
 									))}
 								</tbody>
 							</table>
 						</div>
 					)}
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
