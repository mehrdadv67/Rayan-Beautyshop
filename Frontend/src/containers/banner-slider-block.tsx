import BannerCard from "@components/common/banner-card";
import Carousel from "@components/ui/carousel/carousel";
import { SwiperSlide } from "swiper/react";
import { useBannersQuery } from "@framework/banner/get-all-banners";
import { ROUTES } from "@utils/routes";

interface BannerProps {
  position?: string;
  className?: string;
}

const breakpoints = {
  "0": {
    slidesPerView: 1,
  },
  "768": {
    slidesPerView: 1.5,
  },
};

const BannerSliderBlock: React.FC<BannerProps> = ({
  position = "home_middle",
  className = "mb-12 md:mb-14 xl:mb-16",
}) => {
  const { data, isLoading, error } = useBannersQuery(position);
  const banners = data?.banners?.data ?? [];

  if (isLoading && banners.length === 0) return null;
  if (error) return null;

  // One slide per banner with position = home_middle, so the slider's
  // slide count always matches the number of banners returned by Strapi.
  return (
    <div className={`${className} mx-auto max-w-[1920px] overflow-hidden`}>
      <Carousel
        breakpoints={breakpoints}
        centeredSlides={true}
        loop={banners.length > 1}
        autoplay={{
          delay: 4000,
        }}
        pagination={{
          clickable: true,
        }}
        paginationVariant="circle"
        buttonGroupClassName="hidden"
      >
        {banners.map((banner: any) => (
          <SwiperSlide
            key={`banner--key${banner.id}`}
            className="px-1.5 md:px-2.5 xl:px-3.5"
          >
            <BannerCard
              banner={banner}
              effectActive={true}
              href={
                banner.link
                  ? banner.link
                  : `${ROUTES.COLLECTIONS}/${banner.slug}`
              }
            />
          </SwiperSlide>
        ))}
      </Carousel>
    </div>
  );
};

export default BannerSliderBlock;
