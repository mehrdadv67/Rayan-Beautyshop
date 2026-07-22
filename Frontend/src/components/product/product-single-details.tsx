import React, { useState, useEffect } from "react";
import Button from "@components/ui/button";
import Counter from "@components/common/counter";
import { useRouter } from "next/router";
import { useProductQuery } from "@framework/product/get-product";
import { getVariations, findVariant } from "@framework/utils/get-variations";
import usePrice from "@framework/product/use-price";
import { useCart } from "@contexts/cart/cart.context";
import { generateCartItem } from "@utils/generate-cart-item";
import ProductAttributesDropdown from "./product-attributes-dropdown";
import isEmpty from "lodash/isEmpty";
import Link from "@components/ui/link";
import { toast } from "react-toastify";
import { useWindowSize } from "@utils/use-window-size";
import Carousel from "@components/ui/carousel/carousel";
import { SwiperSlide } from "swiper/react";
import ProductMetaReview from "@components/product/product-meta-review";
import { useSsrCompatible } from "@utils/use-ssr-compatible";

const productGalleryCarouselResponsive = {
  "768": {
    slidesPerView: 2,
  },
  "0": {
    slidesPerView: 1,
  },
};

const ProductSingleDetails: React.FC = () => {
  const {
    query: { slug },
  } = useRouter();
  const { width } = useSsrCompatible(useWindowSize(), { width: 0, height: 0 });
  const { data, isLoading } = useProductQuery(slug as string);
  const { addItemToCart } = useCart();
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);

  useEffect(() => {
    if (!data?.variations?.length || !isEmpty(attributes)) return;
    const defaultVariant =
      data.display_price && !data.sale_price
        ? data.variations.find(
            (v: any) => v.price === data.display_price,
          )
        : undefined;
    const fallbackVariant = data.variations.find(
      (v: any) => v.isActive !== false,
    );
    const target = defaultVariant || fallbackVariant;
    if (target?.value) {
      setAttributes({ [target.title as string]: target.value });
    }
  }, [data, attributes]);

  const variations = getVariations(data?.variations);
  const selectedVariant = findVariant(data?.variations, attributes);

  const { price, basePrice, discount } = usePrice(
    data && {
      amount: selectedVariant
        ? (selectedVariant.sale_price ?? selectedVariant.price)
        : data.sale_price
          ? data.sale_price
          : data.price,
      baseAmount: selectedVariant ? selectedVariant.price : data.price,
      currencyCode: "IRR",
    },
  );

  const isSelected = !isEmpty(variations)
    ? !isEmpty(attributes) &&
      Object.keys(variations).every((variation) =>
        attributes.hasOwnProperty(variation),
      )
    : true;

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>محصول یافت نشد.</p>;

  function addToCart() {
    if (!isSelected) return;
    // to show btn feedback while product carting
    setAddToCartLoader(true);
    setTimeout(() => {
      setAddToCartLoader(false);
    }, 600);

    const item = generateCartItem(
      data!,
      attributes,
      selectedVariant?.price,
      selectedVariant?.sale_price,
    );
    addItemToCart(item, quantity);
    toast("به سبد خرید اضافه شد", {
      progressClassName: "fancy-progress-bar",
      position: width > 768 ? "bottom-right" : "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    console.log(item, "item");
  }

  function handleAttribute(attribute: any) {
    setAttributes((prev) => ({
      ...prev,
      ...attribute,
    }));
  }

  return (
    <div className='block lg:grid grid-cols-9 gap-x-10 xl:gap-x-14 pt-7 pb-10 lg:pb-14 2xl:pb-20 items-start'>
      {width < 1025 ? (
        <Carousel
          pagination={{
            clickable: true,
          }}
          breakpoints={productGalleryCarouselResponsive}
          className='product-gallery'
          buttonGroupClassName='hidden'
        >
          {data?.gallery?.map((item, index: number) => (
            <SwiperSlide key={`product-gallery-key-${index}`}>
              <div className='col-span-1 transition duration-150 ease-in hover:opacity-90'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    item?.original ??
                    "/assets/placeholder/products/product-gallery.svg"
                  }
                  alt={`${data?.name}--${index}`}
                  className='object-cover w-full'
                />
              </div>
            </SwiperSlide>
          ))}
        </Carousel>
      ) : (
        <div className='col-span-5 grid grid-cols-2 gap-2.5'>
          {data?.gallery?.map((item, index: number) => (
            <div
              key={index}
              className='col-span-1 transition duration-150 ease-in hover:opacity-90'
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  item?.original ??
                  "/assets/placeholder/products/product-gallery.svg"
                }
                alt={`${data?.name}--${index}`}
                className='object-cover w-full'
              />
            </div>
          ))}
        </div>
      )}

      <div className='col-span-4 pt-8 lg:pt-0'>
        <div className='pb-7 mb-7 border-b border-gray-300'>
          <h2 className='text-heading text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-bold hover:text-black mb-3.5'>
            {data?.name}
          </h2>
          <p className='text-body text-sm lg:text-base leading-6 lg:leading-8'>
            {data?.description}
          </p>
          <div className='flex items-center mt-5'>
            <div className='text-heading font-bold text-base md:text-xl lg:text-2xl 2xl:text-4xl ltr:pr-2 rtl:pl-2 ltr:md:pr-0 rtl:md:pl-0 ltr:lg:pr-2 rtl:lg:pl-2 ltr:2xl:pr-0 rtl:2xl:pl-0'>
              {price}
            </div>
            {discount && (
              <span className='line-through font-segoe text-gray-400 text-sm md:text-base lg:text-lg xl:text-xl ltr:pl-2 rtl:pr-2'>
                {basePrice}
              </span>
            )}
          </div>
        </div>

        <div className='pb-3 border-b border-gray-300'>
          {Object.keys(variations).map((variation) => {
            return (
              <ProductAttributesDropdown
                key={variation}
                title={variation}
                attributes={variations[variation]}
                active={attributes[variation]}
                onClick={handleAttribute}
              />
            );
          })}
        </div>
        <div className='flex items-center gap-x-4 ltr:md:pr-32 rtl:md:pl-32 ltr:lg:pr-12 rtl:lg:pl-12 ltr:2xl:pr-32 rtl:2xl:pl-32 ltr:3xl:pr-48 rtl:3xl:pl-48  border-b border-gray-300 py-8'>
          <Counter
            quantity={quantity}
            onIncrement={() => setQuantity((prev) => prev + 1)}
            onDecrement={() =>
              setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
            }
            disableDecrement={quantity === 1}
          />
          <Button
            onClick={addToCart}
            variant='slim'
            className={`w-full md:w-6/12 xl:w-full ${
              !isSelected && "bg-gray-400 hover:bg-gray-400"
            }`}
            disabled={!isSelected}
            loading={addToCartLoader}
          >
            <span className='py-2 3xl:px-8'>افزودن به سبد خرید</span>
          </Button>
        </div>
        <div className='py-6'>
          <ul className='text-sm space-y-5 pb-1'>
            <li>
              <span className='font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2'>
                کد محصول:
              </span>
              {selectedVariant?.sku ?? data?.sku}
            </li>
            <li>
              <span className='font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2'>
                موجودی:
              </span>
              {selectedVariant ? selectedVariant.stock : data?.quantity}
            </li>
            <li>
              <span className='font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2'>
                دسته بندی:
              </span>
              <Link
                href='/'
                className='transition hover:underline hover:text-heading'
              >
                {data?.category?.name}
              </Link>
            </li>
            {data?.tags && Array.isArray(data.tags) && (
              <li className='productTags'>
                <span className='font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2'>
                  برچسب ها:
                </span>
                {data.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={tag.slug}
                    className='inline-block ltr:pr-1.5 rtl:pl-1.5 transition hover:underline hover:text-heading ltr:last:pr-0 rtl:last:pl-0'
                  >
                    {tag.name}
                    <span className='text-heading'>،</span>
                  </Link>
                ))}
              </li>
            )}
          </ul>
        </div>

        <ProductMetaReview data={data} />
      </div>
    </div>
  );
};

export default ProductSingleDetails;
