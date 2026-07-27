import SectionHeader from "@components/common/section-header";
import ProductOverlayCard from "@components/product/product-overlay-card";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS, strapiTaggedParams } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeProduct, unwrapList } from "@framework/utils/normalize";
import Alert from "@components/ui/alert";
import { Product } from "@framework/types";
import Image from "next/image";
import cn from "classnames";

interface ProductsProps {
  sectionHeading: string;
  categorySlug?: string;
  className?: string;
  limit?: number;
  variant?: "left" | "center" | "combined" | "flat" | "modern";
  hideBanner?: boolean;
  demoVariant?: "ancient";
  disableBorderRadius?: boolean;
}

const ProductsFeatured: React.FC<ProductsProps> = ({
  sectionHeading,
  categorySlug,
  className = "mb-12 md:mb-14 xl:mb-16",
  variant = "left",
  limit = 5,
  hideBanner = false,
  demoVariant,
  disableBorderRadius = false,
}) => {
  const { data, error } = useQuery<Product[], Error>({
    queryKey: ["featuredProducts", { tag: "new-products" }],
    queryFn: () =>
      http
        .get(
          `${API_ENDPOINTS.PRODUCTS}${strapiTaggedParams("new-products")}`
        )
        .then(({ data }) => unwrapList(data, normalizeProduct) as Product[]),
  });

  return (
    <div className={className}>
      <SectionHeader
        sectionHeading={sectionHeading}
        categorySlug={categorySlug}
      />
      {error ? (
        <Alert message={error?.message} />
      ) : (
        <div
          className={cn(
            `grid grid-cols-4 grid-rows-2 gap-${
              demoVariant === "ancient" ? 1 : 3
            } md:gap-${demoVariant === "ancient" ? 2 : 5} xl:gap-${
              demoVariant === "ancient" ? 1 : 7
            }`,
            {
              "lg:grid-cols-4": variant === "modern",
            }
          )}
        >
          {hideBanner === false && variant === "modern" && (
            <div className="col-span-2 md:row-span-2">
              <Image
                src="/assets/images/products/featured/featured-products-banner.png"
                alt="banner"
                width={435}
                height={647}
                className="rounded-md object-contain"
              />
            </div>
          )}
          {data?.slice(0, limit).map((product: Product, idx: number) => (
            <ProductOverlayCard
              disableBorderRadius={disableBorderRadius}
              key={`product--key${product.id}`}
              product={product}
              variant={variant}
              index={idx}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsFeatured;
