import groupBy from "lodash/groupBy";

export function getVariations(variations: object | undefined) {
  if (!variations) return {};
  return groupBy(variations, "title");
}

/**
 * Given a product's variants (flat array built by normalizeProduct) and the
 * map of currently-selected attribute values ({ attributeSlug: value }), return
 * the single variant whose options contain all selected values.
 */
export function findVariant(
  variants: any[] | undefined,
  attributes: { [key: string]: string } | undefined,
): any | undefined {
  if (!variants || !attributes) return undefined;
  const selectedValues = Object.values(attributes).filter(Boolean);
  if (selectedValues.length === 0) return undefined;

  return variants.find((variant) => {
    const variantValues = Array.isArray(variant?.options)
      ? variant.options
          .map((opt: any) => opt?.attribute_value?.title || opt?.attribute_value?.value)
          .filter(Boolean)
      : [];
    return selectedValues.every((val) => variantValues.includes(val));
  });
}
