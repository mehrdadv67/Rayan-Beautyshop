import isEmpty from "lodash/isEmpty";

interface Item {
  id: string | number;
  name: string;
  slug: string;
  image: {
    thumbnail: string;
    [key: string]: unknown;
  };
  price: number;
  sale_price?: number;
  [key: string]: unknown;
}
export function generateCartItem(
  item: Item,
  attributes: object,
  variantPrice?: number,
  variantSalePrice?: number,
) {
  const { id, name, slug, image } = item;
  const price = variantSalePrice ?? variantPrice ?? item.sale_price ?? item.price;
  return {
    id: !isEmpty(attributes)
      ? `${id}.${Object.values(attributes).join(".")}`
      : id,
    name,
    slug,
    image: image.thumbnail,
    price,
    attributes,
  };
}
