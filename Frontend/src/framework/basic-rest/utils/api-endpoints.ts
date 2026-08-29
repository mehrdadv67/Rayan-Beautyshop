export const API_ENDPOINTS = {
  LOGIN: "/api/auth/local",
  REGISTER: "/api/auth/local/register",
  LOGOUT: "/api/auth/logout",
  FORGET_PASSWORD: "/api/auth/forgot-password",
  USERS_ME: "/api/users/me",
  USERS: "/api/users",
  // --- Strapi REST endpoints (storefront) ---
  CATEGORIES: "/api/categories",
  CATEGORIES_2: "/api/categories",
  CATEGORIES_ANCIENT: "/api/categories",
  FEATURED_CATEGORIES: "/api/categories",
  COLLECTIONS: "/api/product-collections",
  BRANDS: "/api/brands",
  ATTRIBUTES: "/api/attributes",
  PRODUCT_VARIANTS: "/api/product-variants",
  BRANDS_ANCIENT: "/api/brands",
  MENU_ITEMS: "/api/menu-items",
  BANNERS: "/api/banners",
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
  ORDERS: "/api/orders",
  ORDER: "/api/orders",
  ORDER_ITEM: "/api/order-items",
  FOOTER_MENUS: "/api/footer-menus",
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

/**
 * Product populate: gallery (media), brand (relation), category (relation),
 * tags (relation), collections (relation), variants (relation), variants images,
 * variants options, variant option attribute value + attribute.
 */
const PRODUCT_POPULATE =
  "populate[0]=galleryDesktop" +
  "&populate[1]=galleryMobile" +
  "&populate[2]=brand" +
  "&populate[3]=category" +
  "&populate[4]=tags" +
  "&populate[5]=collections" +
  "&populate[6]=variants" +
  "&populate[7]=variants.desktopImages" +
  "&populate[8]=variants.mobileImages" +
  "&populate[9]=variants.options" +
  "&populate[10]=variants.options.attribute_value" +
  "&populate[11]=variants.options.attribute_value.attribute";

/** Order populate: order_items, product in each item, user. */
const ORDER_POPULATE =
  "populate[0]=order_items" +
  "&populate[1]=order_items.order_item" +
  "&populate[2]=customer";

/** Category populate: image (media) + banner. */
const MEDIA_ONLY_POPULATE = "populate[0]=image&populate[1]=banner";

/** Brand populate: logo + coverImage media. */
const BRAND_POPULATE =
  "populate[0]=logo" +
  "&populate[1]=coverImage";

/** Full list query for Products (used for the main products grid). */
export const strapiListParams = () => `?${PRODUCT_POPULATE}${POPULATED_PAGE}`;

/** Full list query for Categories (has image only, no brand/categories). */
export const strapiCategoryParams = () =>
  `?${MEDIA_ONLY_POPULATE}${POPULATED_PAGE}`;

/** Full list query for Brands (has logo + coverImage). */
export const strapiBrandParams = () =>
  `?${BRAND_POPULATE}${POPULATED_PAGE}`;

/** Full list query for Orders. */
export const strapiOrderParams = () => `?${ORDER_POPULATE}${POPULATED_PAGE}`;

/**
 * Banner query: populate both media fields, show only active banners for the
 * requested position (home_top = the masonry block at the top of the home
 * page), sorted by priority ascending.
 */
export const strapiBannerParams = (position = "home_top") =>
  `?populate[0]=desktopImage&populate[1]=mobileImage` +
  `&filters[position][$eq]=${position}` +
  `&filters[isActive][$eq]=true` +
  `&sort[0]=priority:asc&pagination[pageSize]=100`;

/**
 * List query filtered by a product tag slug (e.g. featured, flash-sale).
 * Replaces the old boolean flag filters after moving flags to ProductTag.
 */
export const strapiTaggedParams = (tagSlug: string) =>
  `?${PRODUCT_POPULATE}${POPULATED_PAGE}&filters[tags][slug][$eq]=${encodeURIComponent(
    tagSlug
  )}`;

/**
 * Product collection query params.
 */
export const strapiCollectionParams = () =>
  `?populate[0]=coverImage&populate[1]=products${POPULATED_PAGE}`;

/**
 * @deprecated No-op kept for legacy compatibility.
 * Old boolean flags no longer exist on Product after the schema refactor.
 */
export const strapiFlaggedParams = () =>
  `?${PRODUCT_POPULATE}${POPULATED_PAGE}`;

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

/**
 * Footer menu query: fetch all items with children and icon populated,
 * sorted by priority ascending.
 */
export const strapiFooterMenuParams = () =>
  `?pagination[pageSize]=100&populate[0]=icon&populate[1]=children&sort[0]=priority:asc`;

export const API_TOKEN_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
};
