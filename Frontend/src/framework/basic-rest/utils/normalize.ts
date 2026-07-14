import { Attachment, Brand, Category, Product } from "@framework/types";

/**
 * Strapi v5 response normalizers.
 *
 * Strapi returns nested/normalized data:
 *   { data: [{ id, documentId, name, image: [{ url, formats }], ... }] }
 *   media URLs are relative ("/uploads/x.jpg") and need a host prefix.
 *
 * The ChawkBazar template expects flat objects:
 *   { id, name, slug, price, image: { thumbnail, original }, ... }
 *
 * These helpers bridge that gap so fetchers stay tiny and no component
 * has to change.
 */

const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_URL ?? "";

/**
 * Strapi's "Blocks" rich-text field is an array of
 *   { type, children: [{ type: "text", text: "..." }] }
 * objects. React cannot render an object directly, so flatten it to a
 * plain string. Pass-through if it's already a string.
 */
function blocksToText(value: any): string | undefined {
  if (value == null) return undefined;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value
      .map((block: any) => {
        if (typeof block === "string") return block;
        if (block?.children) {
          return (block.children as any[])
            .map((child: any) =>
              typeof child === "string" ? child : (child?.text ?? ""),
            )
            .join("");
        }
        return block?.text ?? "";
      })
      .join("\n")
      .trim();
  }
  // Fallback: unknown object shape, stringify rather than crash React.
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}

/** Turn a relative Strapi media path into a fully-qualified URL. */
export function absoluteUrl(path?: string): string {
  if (!path) return "";
  return path.startsWith("http") ? path : `${STRAPI_HOST}${path}`;
}

/** A single Strapi media file -> template Attachment { id, thumbnail, original }. */
export function normalizeMedia(file: any): Attachment {
  const formats = file?.formats ?? {};
  return {
    id: file?.id,
    thumbnail: absoluteUrl(formats.thumbnail?.url ?? file?.url),
    original: absoluteUrl(file?.url),
  };
}

/** Strapi media field (array of files) -> first image as Attachment, rest as gallery. */
function splitMedia(media: any): { image: Attachment; gallery: Attachment[] } {
  const files = Array.isArray(media) ? media : media ? [media] : [];
  const items = files.map(normalizeMedia);
  return {
    image: items[0] ?? { id: "", thumbnail: "", original: "" },
    gallery: items,
  };
}

/** Accordion sections for the product detail page (template expects { id, title, content }[]). */
function buildProductMeta(item: any): any[] {
  if (Array.isArray(item?.meta) && item.meta.length > 0) {
    return item.meta;
  }

  const description = blocksToText(item?.description);
  const sections: any[] = [];

  if (description) {
    sections.push({
      id: 1,
      title: "جزئیات محصول",
      content: description,
    });
  }

  sections.push({
    id: sections.length + 1,
    title: "نظرات مشتریان",
    content: "",
  });

  return sections;
}

/** Strapi product entry -> flat template Product. */
export function normalizeProduct(item: any): Product {
  const { image, gallery } = splitMedia(item?.image);
  const description = blocksToText(item?.description);
  return {
    id: item?.id,
    documentId: item?.documentId,
    name: item?.name ?? "",
    slug: item?.slug ?? "",
    price: Number(item?.price ?? 0),
    sale_price: item?.sale_price ? Number(item?.sale_price) : undefined,
    quantity: Number(item?.stock ?? 0),
    image,
    gallery,
    sku: item?.sku,
    description,
    meta: buildProductMeta(item),
    // relations come back already populated because we request populate=*
    brand: item?.brand ? normalizeBrand(item.brand) : undefined,
    category: Array.isArray(item?.categories)
      ? normalizeCategory(item.categories[0])
      : undefined,
    isNewArrival: Boolean(item?.is_new_arrival),
  };
}

/** Strapi category entry -> flat template Category. */
export function normalizeCategory(item: any): Category {
  const { image } = splitMedia(item?.image);
  return {
    id: item?.id,
    documentId: item?.documentId,
    name: item?.name ?? "",
    slug: item?.slug ?? "",
    details: item?.details,
    image,
    productCount: item?.products?.length,
  };
}

/** Strapi brand entry -> flat template Brand. */
export function normalizeBrand(item: any): Brand {
  const { image } = splitMedia(item?.image);
  return {
    id: item?.id,
    documentId: item?.documentId,
    name: item?.name ?? "",
    slug: item?.slug ?? "",
    image,
  };
}

/** Strip the Strapi { data, meta } envelope from a list response and map entries. */
export function unwrapList<T>(
  response: { data: any[] } | any[],
  mapFn: (item: any) => T,
): T[] {
  const arr = Array.isArray(response) ? response : (response?.data ?? []);
  return arr.map(mapFn);
}

// ---------------------------------------------------------------------------
// MENU TREE — rebuild nested shapes from Strapi's flat parent-linked list
// ---------------------------------------------------------------------------

/** A flat menu item as returned by Strapi (with parent populated). */
type RawMenuItem = {
  id: number;
  documentId: string;
  label: string;
  path?: string;
  menu_type: string;
  icon_name?: string;
  sort_order?: number;
  parent?: RawMenuItem | null;
};

/** Mobile shape: { id, label, path, subMenu: [...] } — recursive. */
export type MobileMenuItem = {
  id: number | string;
  label: string;
  path: string;
  subMenu?: MobileMenuItem[];
};

/**
 * Desktop shape. The ChawkBazar mega-menu is exactly 3 levels:
 *   menu[] → columns[] → columnItems[] → columnItemItems[]
 * We map root → menu, level-1 → columnItem, level-2 → columnItemItem.
 * Columns are synthesized from the menu_type=desktop items at level 1.
 */
export type DesktopColumnItemItem = {
  id: number | string;
  path: string;
  label: string;
};
export type DesktopColumnItem = {
  id: number | string;
  path: string;
  label: string;
  columnItemItems: DesktopColumnItemItem[];
};
export type DesktopColumn = {
  id: number | string;
  columnItems: DesktopColumnItem[];
};
export type DesktopMenuItem = {
  id: number | string;
  path: string;
  label: string;
  columns: DesktopColumn[];
  subMenu?: MobileMenuItem[];
};

/** Build the recursive mobile tree from the flat list. */
export function buildMobileMenu(items: RawMenuItem[]): MobileMenuItem[] {
  const byId = new Map<number, RawMenuItem & { children: any[] }>();
  for (const it of items) {
    byId.set(it.id, { ...it, children: [] });
  }
  const roots: (RawMenuItem & { children: any[] })[] = [];
  for (const it of items) {
    const node = byId.get(it.id)!;
    if (it.parent && byId.has(it.parent.id)) {
      byId.get(it.parent.id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  const toMobile = (node: any, index: number): MobileMenuItem => ({
    id: index + 1,
    label: node.label,
    path: node.path || "",
    subMenu: node.children.map((c: any, i: number) => toMobile(c, i)),
  });
  return roots.map((r, i) => toMobile(r, i));
}

/**
 * Build the desktop mega-menu. Strapi stores a flat parent-linked list with
 * arbitrary depth; here we project it onto the template's fixed 3-level
 * columns/columnItems/columnItemItems shape.
 *
 *   root item        → DesktopMenuItem
 *   level-1 child    → DesktopColumnItem
 *   level-2+ child   → DesktopColumnItemItem
 */
export function buildDesktopMenu(items: RawMenuItem[]): DesktopMenuItem[] {
  const byId = new Map<number, RawMenuItem & { children: any[] }>();
  for (const it of items) {
    byId.set(it.id, { ...it, children: [] });
  }
  const roots: (RawMenuItem & { children: any[] })[] = [];
  for (const it of items) {
    const node = byId.get(it.id)!;
    if (it.parent && byId.has(it.parent.id)) {
      byId.get(it.parent.id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  let leafId = 1;
  return roots.map((root, rootIdx) => {
    const level1 = root.children;

    // If any level-1 child has children of its own → mega‑menu (columns).
    // Otherwise → simple dropdown (subMenu).
    const hasGrandchildren = level1.some((child) => child.children.length > 0);

    if (hasGrandchildren) {
      // Mega‑menu: group level‑1 children into columns (max 3 per column).
      const columns: DesktopColumn[] = [];
      for (let i = 0; i < level1.length; i += 3) {
        const slice = level1.slice(i, i + 3);
        columns.push({
          id: Math.floor(i / 3) + 1,
          columnItems: slice.map((colItem) => ({
            id: leafId++,
            path: colItem.path || "",
            label: colItem.label,
            columnItemItems: colItem.children.map((leaf: any) => ({
              id: leafId++,
              path: leaf.path || "",
              label: leaf.label,
            })),
          })),
        });
      }
      return {
        id: rootIdx + 1,
        path: root.path || "",
        label: root.label,
        columns,
      };
    }

    // Simple dropdown: use subMenu (no mega‑menu wrapper).
    return {
      id: rootIdx + 1,
      path: root.path || "",
      label: root.label,
      columns: [],
      subMenu: level1.map((child) => ({
        id: leafId++,
        label: child.label,
        path: child.path || "",
        subMenu:
          child.children.length > 0
            ? child.children.map((grandchild: any) => ({
                id: leafId++,
                label: grandchild.label,
                path: grandchild.path || "",
              }))
            : undefined,
      })),
    };
  });
}
