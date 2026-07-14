import React from "react";
import Link from "@components/ui/link";
import { useTranslation } from "next-i18next";

interface MenuItem {
  id: number | string;
  path: string;
  label: string;
  columnItemItems?: MenuItem[];
}
type MegaMenuProps = {
  columns: {
    id: number | string;
    columnItems: MenuItem[];
  }[];
};

const MegaMenu: React.FC<MegaMenuProps> = ({ columns }) => {
  const { t } = useTranslation("menu");
  const columnWidth = 200; // عرض استاندارد هر ستون
  return (
    <div
      className='absolute bg-gray-200 megaMenu shadow-header top-full ltr:left-0 rtl:right-0'
      style={{ width: `${columns.length * columnWidth}px` }}
    >
      <div className='grid grid-flow-col auto-cols-max gap-4'>
        {columns
          ?.filter((col) => col.columnItems && col.columnItems.length > 0)
          .map((column) => (
            <ul
              className='pt-6 pb-7 w-48 even:bg-gray-150 2xl:pb-8 2xl:pt-7'
              key={column.id}
            >
              {column.columnItems.map((columnItem) => (
                <React.Fragment key={columnItem.id}>
                  <li className='mb-1.5'>
                    <Link
                      href={columnItem.path}
                      className='block text-sm py-1 text-heading font-semibold px-4 hover:text-heading hover:bg-gray-300'
                    >
                      {t(columnItem.label)}
                    </Link>
                  </li>
                  {columnItem?.columnItemItems?.map((item: any) => (
                    <li key={item.id}>
                      <Link
                        href={item.path}
                        className='text-body text-sm block py-1 px-4 hover:text-heading hover:bg-gray-300'
                      >
                        {t(item.label)}
                      </Link>
                    </li>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          ))}
      </div>
    </div>
  );
};

export default MegaMenu;
