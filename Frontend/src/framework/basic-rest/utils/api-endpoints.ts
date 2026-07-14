export const API_ENDPOINTS = {
  LOGIN: "/login",
  REGISTER: "/register",
  LOGOUT: "/logout",
  FORGET_PASSWORD: "/forget-password",
  // --- Strapi REST endpoints (storefront) ---
  CATEGORIES: "/api/categories",
  CATEGORIES_2: "/api/categories",
  CATEGORIES_ANCIENT: "/api/categories",
  FEATURED_CATEGORIES: "/api/categories",
  COLLECTIONS: "/api/categories", // no Collection type yet; reuse categories
  BRANDS: "/api/brands",
  BRANDS_ANCIENT: "/api/brands",
  MENU_ITEMS: "/api/menu-items",
  PRODUCTS: "/api/products",
  PRODUCTS_2: "/api/products",
  PRODUCTS_ANCIENT: "/api/products",
  FEATURED_PRODUCTS: "/api/products",
  FEATURED_PRODUCTS_ANCIENT: "/api/products",
  TOP_SELLER_PRODUCTS: "/api/products",
  ON_SELLING_PRODUCTS: "/api/products",
  PRODUCT: "/api/products",
  RELATED_PRODUCTS: "/api/products",
  BEST_SELLER_PRODUCTS: "/api/products",
  NEW_ARRIVAL_PRODUCTS: "/api/products",
  POPULAR_PRODUCTS: "/api/products",
  NEW_ARRIVAL_PRODUCTS_ANCIENT: "/api/products",
  FLASH_SALE_PRODUCTS: "/api/products",
  FLASH_SALE_PRODUCTS_ANCIENT: "/api/products",
  // --- still on dummy JSON (out of scope this pass) ---
  SHOPS: "/shops.json",
  SHOP: "/shop.json",
  SEARCH: "/api/products",
  ORDERS: "/orders.json",
  ORDER: "/order.json",
};

/**
 * Strapi query-string helpers. Strapi v5 returns media and relations only
 * when explicitly requested via populate, and wraps lists in { data, meta }.
 * We centralize those params here so every fetcher stays one-liner.
 *
 * IMPORTANT: Strapi v5 returns 400 Bad Request if you try to populate
 * fields that don't exist on a content type. Each endpoint must use
 * the populate params that match its schema.
 */

const PAGE_SIZE = 100; // cosmetics catalog is small; pull everything in one page

const POPULATED_PAGE = `&pagination[pageSize]=${PAGE_SIZE}`;

/** Product populate: image (media), brand (relation), categories (relation). */
const PRODUCT_POPULATE =
  "populate[0]=image&populate[1]=brand&populate[2]=categories";

/** Category/Brand populate: image (media) only. */
const MEDIA_ONLY_POPULATE = "populate[0]=image";

/** Full list query for Products (used for the main products grid). */
export const strapiListParams = () => `?${PRODUCT_POPULATE}${POPULATED_PAGE}`;

/** Full list query for Categories (has image only, no brand/categories). */
export const strapiCategoryParams = () =>
  `?${MEDIA_ONLY_POPULATE}${POPULATED_PAGE}`;

/** Full list query for Brands (has image only). */
export const strapiBrandParams = () =>
  `?${MEDIA_ONLY_POPULATE}${POPULATED_PAGE}`;

/** List query filtered by a boolean flag on the product (e.g. is_featured). */
export const strapiFlaggedParams = (flag: string) =>
  `?${PRODUCT_POPULATE}${POPULATED_PAGE}&filters[${flag}][$eq]=true`;

/** List query filtered by a name contains-search (case-insensitive). */
export const strapiSearchParams = (text: string) =>
  `?${PRODUCT_POPULATE}${POPULATED_PAGE}&filters[name][$containsi]=${encodeURIComponent(text)}`;

/**
 * Menu-items query: fetch all items with their parent relation populated.
 * Deep population pulls the full tree in one request (Strapi v5 supports
 * `populate[n][populate][n]` nesting; 5 levels is enough for this menu).
 */
export const strapiMenuParams = () =>
  `?pagination[pageSize]=1000&publicationState=preview&populate=*`;
