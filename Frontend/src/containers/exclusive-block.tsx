"use client";

import Image from 'next/image';
import Link from '@components/ui/link';
import { useTranslation } from 'next-i18next';
import { useBannersQuery } from '@framework/banner/get-all-banners';

interface Props {
  className?: string;
  variant?: 'default' | 'modern';
}

const ExclusiveBlock: React.FC<Props> = ({
  className = 'mb-12 md:mb-14 xl:mb-16',
  variant = 'default',
}) => {
  const { t } = useTranslation('common');
  const { data, isLoading, error } = useBannersQuery('exclusive');
  const banners = data?.banners?.data ?? [];

  const sortedBanners = [...banners]
    .sort((a, b) => (a.priority || 0) - (b.priority || 0))
    .slice(0, 2);

  if (error || sortedBanners.length === 0) return null;

  return (
    <div className={`rounded-md overflow-hidden lg:block ${className}`}>
      <div className="flex justify-between">
        {sortedBanners.map((banner, index) => {
          const isRight = index === 0;
          const isLeft = index === 1;
          const buttonText = banner.alt || banner.title || '';

          return (
            <div
              className={`group w-2/4 flex justify-between items-end relative transition duration-200 ease-in ${
                isLeft && variant === 'modern'
                  ? 'flex-row'
                  : 'flex-row-reverse'
              } ${isLeft ? 'bg-linenSecondary' : 'bg-gray-150'}`}
              key={`exclusive--key${banner.id}`}
            >
              <div
                className={`exclusiveImage relative z-10 flex transform transition duration-200 ease-in group-hover:scale-105 ${
                  variant === 'modern' && isLeft
                    ? 'ltr:mr-auto rtl:ml-auto ltr:2xl:pl-24 rtl:2xl:pr-24 ltr:3xl:pl-40 rtl:3xl:pr-40'
                    : 'ltr:ml-auto rtl:mr-auto ltr:2xl:pr-24 rtl:2xl:pl-24 ltr:3xl:pr-40 rtl:3xl:pl-40'
                }`}
              >
                <Image
                  src={banner.image?.desktop?.url || banner.image?.mobile?.url || ''}
                  alt={buttonText}
                  width={600}
                  height={600}
                  priority={true}
                />
              </div>
              <Link
                href={banner.link || `/collections/${banner.slug}`}
                className={`absolute z-10 bottom-3 sm:bottom-5 inline-block bg-white shadow-product rounded-md text-heading lowercase text-sm xl:text-xl 2xl:text-xl sm:uppercase px-3 sm:px-5 xl:px-6 2xl:px-8 py-2.5 sm:py-4 xl:py-5 2xl:py-7 transform transition duration-300 ease-in-out hover:bg-heading hover:text-white ${
                  isLeft
                    ? variant === 'modern'
                      ? 'ltr:right-3 rtl:left-3 ltr:sm:right-5 rtl:sm:left-5 ltr:xl:right-7 rtl:xl:left-7'
                      : 'ltr:left-3 rtl:right-3 ltr:sm:left-5 rtl:sm:right-5 ltr:xl:left-7 rtl:xl:right-7'
                    : variant === 'modern'
                    ? 'ltr:left-3 rtl:right-3 ltr:sm:left-5 rtl:sm:right-5 ltr:xl:left-7 rtl:xl:right-7'
                    : 'ltr:right-3 rtl:left-3 ltr:sm:right-5 rtl:sm:left-5 ltr:xl:right-7 rtl:xl:left-7'
                } ${
                  variant === 'modern'
                    ? 'xl:top-7 xl:bottom-auto'
                    : 'xl:bottom-7 xl:top-auto'
                }`}
              >
                {buttonText}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExclusiveBlock;
