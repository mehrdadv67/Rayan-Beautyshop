import { QueryKey } from '@tanstack/react-query';

export type CollectionsQueryOptionsType = {
  text?: string;
  collection?: string;
  status?: string;
  limit?: number;
};

export type CategoriesQueryOptionsType = {
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
  demoVariant?: 'ancient';
};
export type ProductsQueryOptionsType = {
  type: string;
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
};
export type QueryOptionsType = {
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
  demoVariant?: 'ancient';
};

export type ShopsQueryOptionsType = {
  text?: string;
  shop?: Shop;
  status?: string;
  limit?: number;
};

export type QueryParamsType = {
  queryKey: QueryKey;
  pageParam?: string;
};
export type Attachment = {
  id: string | number;
  thumbnail: string;
  original: string;
};

// Strapi v5 exposes a documentId alongside the numeric id; optional so
// existing dummy-data usages keep type-checking.
export type StrapiDocumentId = {
  documentId?: string;
};
export type Category = StrapiDocumentId & {
  id: number | string;
  name: string;
  title?: string;
  slug: string;
  description?: string;
  image?: Attachment;
  banner?: Attachment;
  sortOrder?: number;
  isActive?: boolean;
  parentCategory?: Category;
  products?: Product[];
  productCount?: number;
};

export type Brand = StrapiDocumentId & {
  id: number | string;
  name: string;
  slug: string;
  description?: string;
  logo?: Attachment;
  coverImage?: Attachment;
  isActive?: boolean;
};

export type ProductTag = StrapiDocumentId & {
  id: number | string;
  title: string;
  slug: string;
  color?: string;
  icon?: Attachment;
  isActive?: boolean;
};

export type ProductCollection = StrapiDocumentId & {
  id: number | string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: Attachment;
  sortOrder?: number;
  isActive?: boolean;
};

export type Collection = ProductCollection;

export type VariantOption = {
  id?: number | string;
  variant?: ProductVariant;
  attribute_value?: {
    id?: number | string;
    title?: string;
    value?: string;
    meta?: string;
    attribute?: {
      id?: number | string;
      title?: string;
      name?: string;
    };
  };
};

export type ProductVariant = StrapiDocumentId & {
  id: number | string;
  sku: string;
  barcode?: string;
  weight?: number;
  price: number;
  salePrice?: number;
  stock: number;
  isDefault?: boolean;
  isActive?: boolean;
  desktopImages?: Attachment[];
  mobileImages?: Attachment[];
  options?: VariantOption[];
};

export type Variation = {
  id?: number | string;
  title?: string;
  attributeName?: string;
  value: string;
  meta?: string;
  price?: number;
  sale_price?: number;
  stock?: number;
  sku?: string;
  isDefault?: boolean;
  isActive?: boolean;
  attributeValues?: (number | string)[];
};

export type Product = StrapiDocumentId & {
  id: number | string;
  name: string;
  title?: string;
  slug: string;
  description?: any;
  galleryDesktop?: Attachment[];
  galleryMobile?: Attachment[];
  seoTitle?: string;
  seoDescription?: string;
  isActive?: boolean;
  brand?: Brand;
  category?: Category;
  tags?: ProductTag[];
  collections?: ProductCollection[];
  variants?: ProductVariant[];
  display_price?: number;
  price?: number;
  sale_price?: number;
  sku?: string;
  image?: Attachment;
  gallery?: Attachment[];
  meta?: any[];
  variations?: Variation[];
  [key: string]: unknown;
  isNewArrival?: boolean;
};
export type OrderItem = {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
};
export type Order = StrapiDocumentId & {
  id: string | number;
  name: string;
  slug: string;
  products: OrderItem[];
  total: number;
  tracking_number: string;
  customer: {
    id: number;
    email: string;
  };
  shipping_fee: number;
  payment_gateway: string;
  status?: string;
  created_at?: string;
};

export type Shop = {
  id: string | number;
  owner_id: string | number;
  owner_name: string;
  address: string;
  phone: string;
  website: string;
  ratings: string;
  name: string;
  slug: string;
  description: string;
  cover_image: Attachment;
  logo: Attachment;
  socialShare: any;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  gender?: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FooterMenu = {
  id: number | string;
  documentId?: string;
  title: string;
  link?: string;
  priority_type: "top" | "sub";
  priority: number;
  icon?: Attachment;
  parent?: FooterMenu;
  children?: FooterMenu[];
};
