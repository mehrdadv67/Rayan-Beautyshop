import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Subscription from "@components/common/subscription";
import PageHeader from "@components/ui/page-header";
import Scrollbar from "@components/common/scrollbar";
import { useCart } from "@contexts/cart/cart.context";
import usePrice from "@framework/product/use-price";
import CartItem from "@components/cart/cart-item";
import EmptyCart from "@components/cart/empty-cart";
import { ROUTES } from "@utils/routes";
import Link from "@components/ui/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { siteSettings } from "@settings/site-settings";
import { NextSeo } from "next-seo";
import { absoluteSiteUrl } from "@utils/site-url";

export default function CartPage() {
  const { t } = useTranslation("common");
  const { items, total, isEmpty } = useCart();
  const { price: cartTotal } = usePrice({
    amount: total,
    currencyCode: "IRR",
  });

  return (
    <>
      <NextSeo
        title={`${t("text-shopping-cart")} | ${siteSettings.name}`}
        description={siteSettings.description}
        canonical={absoluteSiteUrl(ROUTES.CART)}
      />
      <PageHeader pageHeader="text-page-cart" />
      <Container>
        <div className="py-12 lg:py-16">
          {!isEmpty ? (
            <div className="flex flex-col">
              <div className="flex-grow w-full">
                <Scrollbar className="w-full cart-scrollbar">
                  <div className="w-full px-5 md:px-7">
                    {items?.map((item) => (
                      <CartItem item={item} key={item.id} />
                    ))}
                  </div>
                </Scrollbar>
              </div>
              <div className="flex flex-col px-5 pt-2 pb-5 md:px-7 md:pb-7">
                <div className="flex flex-col border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-heading">
                      {t("text-sub-total")}
                    </span>
                    <span className="text-lg font-bold text-heading">
                      {cartTotal}
                    </span>
                  </div>
                  <Link
                    href={ROUTES.CHECKOUT}
                    className="w-full px-5 py-3 md:py-4 flex items-center justify-center rounded-md text-sm sm:text-base text-white bg-heading hover:bg-gray-600 transition duration-300"
                  >
                    <span className="w-full ltr:pr-5 rtl:pl-5 py-0.5">
                      {t("text-proceed-to-checkout")}
                    </span>
                    <span className="rtl:mr-auto ltr:ml-auto flex-shrink-0 py-0.5 flex">
                      <span className="ltr:border-l rtl:border-r border-white ltr:pr-5 rtl:pl-5 py-0.5" />
                      {cartTotal}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-5 pt-8 pb-5 md:px-7">
              <EmptyCart />
              <h3 className="pt-8 text-lg font-bold text-heading">
                {t("text-empty-cart")}
              </h3>
              <Link
                href={ROUTES.HOME}
                className="mt-4 px-5 py-3 bg-heading text-white rounded-md hover:bg-gray-600 transition duration-300"
              >
                {t("text-continue-shopping")}
              </Link>
            </div>
          )}
        </div>
        <Subscription />
      </Container>
    </>
  );
}

CartPage.Layout = Layout;

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
