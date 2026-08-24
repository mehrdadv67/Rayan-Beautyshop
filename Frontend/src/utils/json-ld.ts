export type ProductJsonLd = {
  name: string;
  description?: string;
  url?: string;
  image?: string;
  brand?: string;
  category?: string;
  sku?: string;
  price?: number;
  currency?: string;
  availability?: 'https://schema.org/InStock' | 'https://schema.org/OutOfStock' | 'https://schema.org/PreOrder';
  condition?: 'https://schema.org/NewCondition' | 'https://schema.org/UsedCondition' | 'https://schema.org/RefurbishedCondition';
  ratingValue?: number;
  reviewCount?: number;
};

export type OrganizationJsonLd = {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  contactPoint?: {
    telephone?: string;
    contactType?: string;
    email?: string;
  };
  sameAs?: string[];
};

export type BreadcrumbJsonLdItem = {
  name: string;
  url: string;
};

export type BreadcrumbJsonLd = {
  items: BreadcrumbJsonLdItem[];
};

export function productJsonLd(data: ProductJsonLd) {
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description || data.name,
    url: data.url,
    image: data.image,
    brand: {
      '@type': 'Brand',
      name: data.brand || '',
    },
    category: data.category,
    sku: data.sku,
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.currency || 'IRR',
      availability: data.availability || 'https://schema.org/InStock',
      url: data.url,
      condition: data.condition || 'https://schema.org/NewCondition',
    },
  };

  if (data.ratingValue && data.reviewCount) {
    (base as Record<string, unknown>).aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.ratingValue,
      reviewCount: data.reviewCount,
    };
  }

  return base;
}

export function organizationJsonLd(data: OrganizationJsonLd) {
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    description: data.description,
    logo: data.logo,
  };

  if (data.contactPoint) {
    (base as Record<string, unknown>).contactPoint = {
      '@type': 'ContactPoint',
      ...data.contactPoint,
    };
  }

  if (data.sameAs && data.sameAs.length > 0) {
    (base as Record<string, unknown>).sameAs = data.sameAs;
  }

  return base;
}

export function breadcrumbJsonLd(data: BreadcrumbJsonLd) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: data.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
