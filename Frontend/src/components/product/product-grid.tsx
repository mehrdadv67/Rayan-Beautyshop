import ProductCard from "@components/product/product-card";
import Button from "@components/ui/button";
import type { FC } from "react";
import { useProductsQuery } from "@framework/product/get-all-products";
import { useRouter } from "next/router";
import ProductFeedLoader from "@components/ui/loaders/product-feed-loader";
import { useTranslation } from "next-i18next";
import { Product } from "@framework/types";
interface ProductGridProps {
  className?: string;
  itemCount?: number;
  query?: Record<string, any>;
}
export const ProductGrid: FC<ProductGridProps> = ({ className = "", itemCount, query: queryProp }) => {
  const router = useRouter();
  const query = queryProp ?? router.query;
  const {
    isFetching: isLoading,
    isFetchingNextPage: loadingMore,
    fetchNextPage,
    hasNextPage,
    data,
    error,
  } = useProductsQuery({ limit: 10, ...query });
  const { t } = useTranslation("common");

  const totalItems =
    itemCount ??
    data?.pages?.reduce(
      (sum, page) => sum + (page?.data?.length || 0),
      0
    ) ??
    0;

  if (error) return <p>{error.message}</p>;

  const hasProducts = data?.pages?.some((page) => page?.data?.length > 0);

  return (
    <>
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-3 lg:gap-x-5 xl:gap-x-7 gap-y-3 xl:gap-y-5 2xl:gap-y-8 ${className}`}
      >
        {isLoading && !data?.pages?.length ? (
          <ProductFeedLoader limit={20} uniqueKey="search-product" />
        ) : hasProducts ? (
          data?.pages?.map((page) => {
            return page?.data?.map((product: Product) => (
              <ProductCard
                key={`product--key${product.id}`}
                product={product}
                variant="grid"
              />
            ));
          })
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            {t('text-no-products-found', 'هیچ محصولی یافت نشد')}
          </div>
        )}
      </div>
      <div className="text-center pt-8 xl:pt-14">
        {hasNextPage && (
          <Button
            loading={loadingMore}
            disabled={loadingMore}
            onClick={() => fetchNextPage()}
            variant="slim"
          >
            {t("button-load-more")}
          </Button>
        )}
      </div>
    </>
  );
};
