"use client";

import BannerCard from "@components/common/banner-card";
import { ROUTES } from "@utils/routes";
import { useBannersQuery } from "@framework/banner/get-all-banners";

interface BannerBlockStrapiProps {
  position?: string;
  className?: string;
}

const BannerBlockStrapi: React.FC<BannerBlockStrapiProps> = ({
  position = "home_top",
  className = "mb-12 md:mb-14 xl:mb-16 px-2.5",
}) => {
  const { data, isLoading, error } = useBannersQuery(position);
  const banners = data?.banners?.data ?? [];

  if (error) return null;
  if (isLoading && banners.length === 0) return null;

  return (
    <div
      className={`${className} grid grid-cols-2 sm:grid-cols-9 gap-2 md:gap-2.5 max-w-[1920px] mx-auto`}
    >
      {banners.map((banner: any) => {
        const href = banner.link
          ? banner.link
          : `${ROUTES.COLLECTIONS}/${banner.slug}`;
        return (
          <BannerCard
            key={`banner--key${banner.id}`}
            banner={banner}
            href={href}
            effectActive={true}
            variant="default"
            className={
              banner.type === "medium"
                ? "col-span-full sm:col-span-5"
                : "col-span-1 sm:col-span-2"
            }
          />
        );
      })}
    </div>
  );
};

export default BannerBlockStrapi;
