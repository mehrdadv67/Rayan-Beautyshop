import { useTranslation } from "next-i18next";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";
import Link from "./link";
import MegaMenu from "./mega-menu";
import cn from "classnames";

const ListMenu = ({
  dept,
  data,
  hasSubMenu,
  hasMegaMenu,
  hasBrands,
  hasBanners,
  menuIndex,
}: any) => {
  const { t } = useTranslation("menu");
  return (
    <li className={cn(!hasMegaMenu ? "group relative" : "")}>
      <Link
        href={data.path}
        className='flex items-center py-1.5 ltr:pl-5 rtl:pr-5 ltr:xl:pl-7 rtl:xl:pr-7 ltr:pr-3 rtl:pl-3 ltr:xl:pr-3.5 rtl:xl:pl-3.5 hover:text-heading hover:bg-gray-300'
      >
        {data.icon && (
          <span className='inline-flex ltr:mr-2 rtl:ml-2'>{data.icon}</span>
        )}
        {t(data.label)}
        {data.subMenu && (
          <span className='text-sm mt-0.5 shrink-0 ltr:ml-auto rtl:mr-auto'>
            <IoIosArrowForward className='transition duration-300 ease-in-out text-body group-hover:-rotate-180' />
          </span>
        )}
      </Link>

      {/* SubMenu */}
      {hasSubMenu && (
        <SubMenu dept={dept} data={data.subMenu} menuIndex={menuIndex} />
      )}

      {/* MegaMenu, Brands, Banners */}
      {(hasMegaMenu || hasBrands || hasBanners) && (
        <div className='absolute flex bg-white categoryMegaMenu shadow-header left-0 top-full w-auto'>
          <div className='flex-shrink-0'>
            <MegaMenu columns={hasMegaMenu} />
          </div>
          <div className='hidden xl:block'>
            <div className='grid grid-cols-3 gap-3 p-6 2xl:py-8 2xl:px-7 justify-items-center'>
              {hasBrands?.map((brand: any) => (
                <Link
                  href={brand.path}
                  key={brand.id}
                  className='bg-gray-200 border border-gray-300 rounded-md'
                >
                  <Image
                    src={brand.icon.src}
                    height={60}
                    width={150}
                    alt={brand.label}
                  />
                </Link>
              ))}
            </div>
            <div className='grid grid-cols-2 gap-3 p-6 border-t border-gray-300 2xl:py-8 2xl:px-7'>
              {hasBanners?.map((banner: any) => (
                <Link href={banner.path} key={banner.id}>
                  <img className='' src={banner.image.src} alt={banner.label} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

const SubMenu: React.FC<any> = ({ dept, data, menuIndex }) => {
  dept = dept + 1;
  return (
    <ul className='absolute z-0 invisible w-56 py-3 bg-gray-200 opacity-0 subMenuChild shadow-subMenu left-0 top-full'>
      {data?.map((menu: any, index: number) => {
        const menuName: string = `sidebar-submenu-${dept}-${menuIndex}-${index}`;

        return (
          <ListMenu
            dept={dept}
            data={menu}
            hasSubMenu={menu.subMenu}
            menuName={menuName}
            key={menuName}
            menuIndex={index}
          />
        );
      })}
    </ul>
  );
};

export default ListMenu;
