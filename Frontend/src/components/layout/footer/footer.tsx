import Widgets from './widgets'
import Copyright from './copyright'
import { footer } from './data'
import { useFooterMenusQuery } from '@framework/footer-menu/get-footer-menus'
import { FooterMenu } from '@framework/types'
import Image from 'next/image'

const { widgets, payment } = footer

const mapFooterMenusToWidgets = (menus: FooterMenu[]) => {
  const topItems = menus
    .filter((menu) => menu.priority_type === "top")
    .sort((a, b) => a.priority - b.priority);

  const widgets = topItems.map((topItem) => {
    const subItems = (topItem.children || [])
      .filter((child) => child.priority_type === "sub")
      .sort((a, b) => a.priority - b.priority)
      .map((child) => ({
        id: String(child.id),
        title: child.title,
        path: child.link || '#',
        icon: child.icon ? <Image src={child.icon.thumbnail} alt={child.title} width={20} height={20} /> : undefined,
      }));

    return {
      id: topItem.id,
      widgetTitle: topItem.title,
      lists: subItems.length > 0 ? subItems : [
        { id: String(topItem.id), title: topItem.title, path: topItem.link || '#' }
      ],
    };
  });

  return widgets;
};

const Footer: React.FC = () => {
  const { data: footerMenus, isLoading } = useFooterMenusQuery();
  
  const widgetsData = footerMenus?.length ? mapFooterMenusToWidgets(footerMenus) : widgets;
  
  return (
    <footer className='border-b-4 border-heading mt-9 md:mt-11 lg:mt-16 3xl:mt-20 pt-2.5 lg:pt-0 2xl:pt-2'>
      <Widgets widgets={widgetsData as any} />
      <Copyright payment={payment} />
    </footer>
  )
}

export default Footer
