import isEmpty from "lodash/isEmpty";
import { Product } from "@framework/types";

export function generateCartItem(
  item: Product,
  attributes: object,
  variantPrice?: number,
  variantSalePrice?: number,
) {
  const { id, name, slug, image } = item;
  const price = Number(
    variantSalePrice ?? variantPrice ?? item.sale_price ?? item.price ?? 0
  );
  return {
    id: !isEmpty(attributes)
      ? `${id}.${Object.values(attributes).join(".")}`
      : id,
    name,
    slug,
    image: image?.thumbnail,
    price,
    attributes,
  };
}
