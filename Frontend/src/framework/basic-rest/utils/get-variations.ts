import groupBy from "lodash/groupBy";

export function getVariations(variations: object | undefined) {
  if (!variations) return {};
  return groupBy(variations, "title");
}

/**
 * Given a product's variations (flat list built by normalizeProduct) and the
 * map of currently-selected attribute values ({ attributeSlug: value }), return
 * the single variation whose value matches the selection, or undefined.
 * Used to switch the displayed price / sale price / stock on the detail page.
 */
export function findVariant(
  variations: any[] | undefined,
  attributes: { [key: string]: string } | undefined,
): any | undefined {
  if (!variations || !attributes) return undefined;
  const selectedValues = Object.values(attributes).filter(Boolean);
  if (selectedValues.length === 0) return undefined;
  return variations.find((v) => selectedValues.includes(v.value));
}
