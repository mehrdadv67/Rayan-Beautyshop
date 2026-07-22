import React, { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { HiCheck, HiChevronDown } from "react-icons/hi";
import cn from "classnames";

interface Attribute {
  id: number;
  value: string;
  meta: string;
}

interface Props {
  className?: string;
  title: string;
  attributes: Attribute[];
  active: string;
  onClick: any;
}

const attributeTitleMap: { [key: string]: string } = {
  size: "اندازه",
  color: "رنگ",
  volume: "حجم",
  weight: "وزن",
  material: "جنس",
  fragrance: "عطر",
  flavor: "طعم",
};

function getAttributeTitle(slug: string): string {
  return attributeTitleMap[slug] || slug;
}

const ProductAttributesDropdown: React.FC<Props> = ({
  className = "mb-4",
  title,
  attributes,
  active,
  onClick,
}) => {
  const displayTitle = getAttributeTitle(title);
  const selectedAttribute = attributes.find((attr) => attr.value === active);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (attr: Attribute) => {
    onClick({ [title]: attr.value });
    setIsOpen(false);
  };

  return (
    <div className={className}>
      <h3 className='text-base md:text-lg text-heading font-semibold mb-2.5 capitalize'>
        {displayTitle}
      </h3>
      <div className='relative'>
        <Listbox
          value={selectedAttribute || attributes[0]}
          onChange={handleSelect}
        >
          {({ open }) => (
            <>
              <Listbox.Button
                className={cn(
                  "relative w-auto min-w-[120px] py-3 ltr:pl-4 rtl:pr-4 ltr:pr-10 rtl:pl-10 ltr:text-left rtl:text-right",
                  "bg-white border border-gray-200 rounded-lg shadow-sm",
                  "text-sm md:text-base text-heading font-medium",
                  "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-blue-500",
                  "transition-all duration-200 hover:border-gray-400",
                  open && "border-blue-500 ring-1 ring-blue-500",
                )}
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className='block truncate'>
                  {selectedAttribute ? selectedAttribute.value : "انتخاب کنید"}
                </span>
                <span className='absolute inset-y-0 ltr:right-0 rtl:left-0 flex items-center ltr:pr-3 rtl:pl-3 pointer-events-none'>
                  <HiChevronDown
                    className={cn(
                      "w-5 h-5 text-gray-400 transition-transform duration-200",
                      open && "transform rotate-180",
                    )}
                    aria-hidden='true'
                  />
                </span>
              </Listbox.Button>
              <Transition
                show={open}
                as={Fragment}
                leave='transition ease-in duration-100'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <Listbox.Options
                  static
                  className={cn(
                    "absolute w-auto py-1 mt-1 overflow-auto bg-white rounded-lg shadow-lg",
                    "max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none",
                    "z-50 border border-gray-100",
                  )}
                >
                  {attributes?.map((attr) => (
                    <Listbox.Option
                      key={`${attr.value}-${attr.id}`}
                      className={({ active: isActive }) =>
                        cn(
                          "cursor-default select-none relative py-2.5 ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4",
                          "transition-colors duration-150",
                          isActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-900",
                        )
                      }
                      value={attr}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={cn(
                              "block truncate text-sm md:text-base",
                              selected ? "font-semibold" : "font-normal",
                            )}
                          >
                            {title === "color" && attr.meta ? (
                              <span className='flex items-center gap-x-2'>
                                <span
                                  className='inline-block w-5 h-5 rounded-full border border-gray-200'
                                  style={{ backgroundColor: attr.meta }}
                                />
                                {attr.value}
                              </span>
                            ) : (
                              attr.value
                            )}
                          </span>
                          {selected ? (
                            <span className='absolute inset-y-0 ltr:left-0 rtl:right-0 flex items-center ltr:pl-3 rtl:pr-3 text-blue-600'>
                              <HiCheck className='w-5 h-5' aria-hidden='true' />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </>
          )}
        </Listbox>
      </div>
    </div>
  );
};

export default ProductAttributesDropdown;
