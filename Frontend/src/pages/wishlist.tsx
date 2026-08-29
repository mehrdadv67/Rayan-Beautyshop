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
import { useWishlist } from "@contexts/wishlist/wishlist.context";
import ProductCard from "@components/product/product-card";
import Link from "@components/ui/link";
import { ROUTES } from "@utils/routes";

export default function WishlistPage() {
 	const { t } = useTranslation("common");
 	const { items, isEmpty, removeFromWishlist } = useWishlist();

 	return (
 		<>
 			<NextSeo
 				title={`${t('text-page-wishlist')} | ${siteSettings.name}`}
 				description={siteSettings.description}
 				canonical={absoluteSiteUrl('/wishlist')}
 			/>
 			<PageHeader pageHeader="text-page-wishlist" />
 			<Container>
 				<div className="py-16 lg:py-20">
 					{isEmpty ? (
 						<p className="text-center text-body">{t('text-wishlist-empty', 'لیست علاقه‌مندی‌های شما خالی است.')}</p>
 					) : (
 						<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-3 lg:gap-x-5 xl:gap-x-7 gap-y-3 xl:gap-y-5 2xl:gap-y-8">
 							{items.map((item) => (
 								<div key={item.id} className="relative">
 									<ProductCard
 										product={item as any}
 										variant="grid"
 									/>
 									<button
 										onClick={() => removeFromWishlist(item.id)}
 										className="absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition"
 										aria-label="Remove from wishlist"
 									>
 										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
 											<line x1="18" y1="6" x2="6" y2="18" />
 											<line x1="6" y1="6" x2="18" y2="18" />
 										</svg>
 									</button>
 								</div>
 							))}
 						</div>
 					)}
 				</div>
 				<Subscription />
 			</Container>
 		</>
 	);
 }

 WishlistPage.Layout = Layout;

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
