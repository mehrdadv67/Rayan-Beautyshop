import { CheckBox } from "@components/ui/checkbox";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "next-i18next";
import { useQuery } from "@tanstack/react-query";

interface PriceRange {
  id: string;
  name: string;
  slug: string;
}

const formatToman = (n: number) =>
  new Intl.NumberFormat("fa-IR").format(Math.round(n));

/** Round to a "nice" number for readable range boundaries. */
const niceRound = (n: number) => {
  if (n >= 10_000_000) return Math.round(n / 1_000_000) * 1_000_000;
  if (n >= 1_000_000) return Math.round(n / 500_000) * 500_000;
  if (n >= 100_000) return Math.round(n / 100_000) * 100_000;
  return Math.round(n / 10_000) * 10_000;
};

/**
 * Build 4 price buckets from the real min/max of variant prices
 * (regular + sale) fetched from Strapi.
 */
const buildRanges = (prices: number[]): PriceRange[] => {
  if (prices.length === 0) return [];
  const min = niceRound(prices[0]);
  const max = niceRound(prices[prices.length - 1]);
  if (min >= max) {
    return [
      {
        id: "1",
        name: `تا ${formatToman(max)} تومان`,
        slug: `0-${max}`,
      },
    ];
  }
  const step = (max - min) / 4;
  const buckets: PriceRange[] = [];
  let lo = min;
  for (let i = 0; i < 4; i++) {
    const hi = i === 3 ? max : niceRound(min + step * (i + 1));
    buckets.push({
      id: String(i + 1),
      name: `${formatToman(lo)} تا ${formatToman(hi)} تومان`,
      slug: `${lo}-${hi}`,
    });
    lo = hi;
  }
  return buckets;
};

const fetchPriceRanges = async (): Promise<PriceRange[]> => {
  const { data } = await http.get(
    `${API_ENDPOINTS.PRODUCT_VARIANTS}?fields[0]=price&fields[1]=salePrice&pagination[pageSize]=100`
  );
  const list = Array.isArray(data?.data) ? data.data : [];
  const prices: number[] = [];
  for (const v of list) {
    if (v.salePrice != null) prices.push(Number(v.salePrice));
    else if (v.price != null) prices.push(Number(v.price));
  }
  prices.sort((a, b) => a - b);
  return buildRanges(prices);
};

const usePriceRangesQuery = () =>
  useQuery({
    queryKey: ["price-ranges"],
    queryFn: fetchPriceRanges,
    staleTime: 5 * 60 * 1000,
  });

export const PriceFilter = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { pathname, query } = router;
  const { data: priceFilterItems, isLoading } = usePriceRangesQuery();

  const selectedPrices = query?.price ? (query.price as string).split(",") : [];
  const [formState, setFormState] = React.useState<string[]>(selectedPrices);
  React.useEffect(() => {
    setFormState(selectedPrices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query?.price]);

  function handleItemClick(e: React.FormEvent<HTMLInputElement>): void {
    const { value } = e.currentTarget;
    const currentFormState = formState.includes(value)
      ? formState.filter((i) => i !== value)
      : [...formState, value];
    const { price, ...restQuery } = query;
    router.push(
      {
        pathname,
        query: {
          ...restQuery,
          ...(!!currentFormState.length
            ? { price: currentFormState.join(",") }
            : {}),
        },
      },
      undefined,
      { scroll: false }
    );
  }

  if (isLoading || !priceFilterItems || priceFilterItems.length === 0) {
    return null;
  }

  return (
    <div className="block border-b border-gray-300 pb-7 mb-7">
      <h3 className="text-heading text-sm md:text-base font-semibold mb-7">
        {t("text-price")}
      </h3>
      <div className="mt-2 flex flex-col space-y-4">
        {priceFilterItems.map((item) => (
          <CheckBox
            key={item.id}
            label={item.name}
            name={item.name}
            checked={formState.includes(item.slug)}
            value={item.slug}
            onChange={handleItemClick}
          />
        ))}
      </div>
    </div>
  );
};
