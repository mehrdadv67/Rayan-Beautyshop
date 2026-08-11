import BannerCard from "@components/common/banner-card";
import Container from "@components/ui/container";
import BrandGridBlock from "@containers/brand-grid-block";
import CategoryBlock from "@containers/category-block";
import Layout from "@components/layout/layout";
import BannerWithProducts from "@containers/banner-with-products";
import BannerBlockStrapi from "@containers/banner-block-strapi";
import Divider from "@components/ui/divider";
import DownloadApps from "@components/common/download-apps";
import Support from "@components/common/support";
import Instagram from "@components/common/instagram";
import ProductsFlashSaleBlock from "@containers/product-flash-sale-block";
import ProductsFeatured from "@containers/products-featured";
import BannerSliderBlock from "@containers/banner-slider-block";
import ExclusiveBlock from "@containers/exclusive-block";
import Subscription from "@components/common/subscription";
import NewArrivalsProductFeed from "@components/product/feeds/new-arrivals-product-feed";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { API_ENDPOINTS, strapiBannerParams } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeBanner, unwrapList } from "@framework/utils/normalize";
import { ROUTES } from "@utils/routes";

interface HomeProps {
  bottomBanners: any[];
}

export default function Home({ bottomBanners }: HomeProps) {
  return (
    <>
      <BannerBlockStrapi position='home_top' />
      <Container>
        <ProductsFlashSaleBlock date={"2024-12-01T01:02:03"} />
      </Container>
      <BannerSliderBlock />
      <Container>
        <CategoryBlock sectionHeading='text-shop-by-category' type='rounded' />
        <ProductsFeatured sectionHeading='text-featured-products' limit={5} />
        {bottomBanners[0] && (
          <BannerCard
            key={`banner--key${bottomBanners[0].id}`}
            banner={bottomBanners[0]}
            href={bottomBanners[0].link || `${ROUTES.COLLECTIONS}/${bottomBanners[0].slug}`}
            className='mb-12 lg:mb-14 xl:mb-16 pb-0.5 lg:pb-1 xl:pb-0'
          />
        )}
        <BrandGridBlock sectionHeading='text-top-brands' />
        {bottomBanners[1] && (
          <BannerCard
            key={`banner--key${bottomBanners[1].id}`}
            banner={bottomBanners[1]}
            href={bottomBanners[1].link || `${ROUTES.COLLECTIONS}/${bottomBanners[1].slug}`}
            className='mb-12 lg:mb-14 xl:mb-16 pb-0.5 lg:pb-1 xl:pb-0'
          />
        )}
        <BannerWithProducts
          sectionHeading='text-on-selling-products'
          categorySlug='/search'
        />
        <ExclusiveBlock />
        <NewArrivalsProductFeed />
        {/* <DownloadApps /> */}
        {/* <Support /> */}
        {/* <Instagram /> */}
        <Subscription className='px-5 py-12 bg-opacity-0 sm:px-16 xl:px-0 md:py-14 xl:py-16' />
      </Container>
      <Divider className='mb-0' />
    </>
  );
}

Home.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const { data } = await http.get(
      `${API_ENDPOINTS.BANNERS}${strapiBannerParams("home_bottom")}`,
    );

    const banners = unwrapList(data, normalizeBanner);

    return {
      props: {
        ...(await serverSideTranslations(locale!, [
          "common",
          "forms",
          "menu",
          "footer",
        ])),
        bottomBanners: banners.slice(0, 2),
      },
    };
  } catch (error) {
    return {
      props: {
        ...(await serverSideTranslations(locale!, [
          "common",
          "forms",
          "menu",
          "footer",
        ])),
        bottomBanners: [],
      },
    };
  }
};
