import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Subscription from "@components/common/subscription";
import ProductSingleDetails from "@components/product/product-single-details";
import RelatedProducts from "@containers/related-products";
import Divider from "@components/ui/divider";
import Breadcrumb from "@components/common/breadcrumb";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import Head from "next/head";
import { siteSettings } from "@settings/site-settings";
import { absoluteSiteUrl } from "@utils/site-url";
import { productJsonLd, breadcrumbJsonLd } from "@utils/json-ld";
import { normalizeProduct } from "@framework/utils/normalize";
import http from "@framework/utils/http";

interface ProductPageProps {
  product?: ReturnType<typeof normalizeProduct>;
}

function ProductSeo({ product }: { product: ReturnType<typeof normalizeProduct> }) {
  const baseUrl = absoluteSiteUrl("/");
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const title = product.seoTitle || product.name;
  const description = product.seoDescription || product.description || siteSettings.description;
  const image = product.image?.original || product.gallery?.[0]?.original || "/assets/images/og-image-01.png";

  const ld = productJsonLd({
    name: product.name,
    description: product.description,
    url: productUrl,
    image: image,
    brand: product.brand?.name,
    category: product.category?.name,
    sku: product.sku,
    price: product.price,
    currency: "IRR",
    availability: product.display_price && product.display_price > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
  });

  const breadcrumbLd = breadcrumbJsonLd({
    items: [
      { name: "خانه", url: baseUrl },
      { name: "محصولات", url: `${baseUrl}/products` },
      { name: product.name, url: productUrl },
    ],
  });

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={productUrl}
        openGraph={{
          url: productUrl,
          title: title,
          description: description,
          images: [
            {
              url: image,
              width: 800,
              height: 600,
              alt: product.name,
            },
          ],
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
      </Head>
    </>
  );
}

export default function ProductPage({ product }: ProductPageProps) {
  return (
    <>
      <Divider className="mb-0" />
      <Container>
        <div className="pt-8">
          <Breadcrumb />
        </div>
        {product && <ProductSeo product={product} />}
        <ProductSingleDetails />
        <RelatedProducts sectionHeading="text-related-products" />
        <Subscription />
      </Container>
    </>
  );
}

ProductPage.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async ({ locale, params }) => {
  const slug = params?.slug as string;
  let product;

  try {
    const { data } = await http.get(
      `/products?filters[slug][$eq]=${encodeURIComponent(slug)}`
    );
    const list = Array.isArray(data?.data) ? data.data : [];
    product = normalizeProduct(list[0]);
  } catch (error) {
    console.error("Failed to fetch product for SEO:", error);
  }

  return {
    props: {
      product: product || null,
      ...(await serverSideTranslations(locale!, [
        "common",
        "forms",
        "menu",
        "footer",
      ])),
    },
  };
};
