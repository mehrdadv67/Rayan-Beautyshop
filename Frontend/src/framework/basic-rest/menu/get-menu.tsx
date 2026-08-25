import {
  API_ENDPOINTS,
  strapiMenuParams,
} from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import {
  buildDesktopMenu,
  buildMobileMenu,
  DesktopMenuItem,
  MobileMenuItem,
} from "@framework/utils/normalize";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetch the full menu (desktop + mobile) from Strapi.
 *
 * The menu-items collection stores a flat parent-linked list; a single
 * deeply-populated request returns every node, and the normalizer rebuilds
 * the two shapes the header expects:
 *   - desktop: { menu: [...], columns/columnItems/columnItemItems }
 *   - mobile:  { mobileMenu: [...], subMenu recursive }
 */
export type SiteMenu = {
  menu: DesktopMenuItem[];
  mobileMenu: MobileMenuItem[];
};

const fetchMenu = async (): Promise<SiteMenu> => {
  const { data } = await http.get(
    `${API_ENDPOINTS.MENU_ITEMS}${strapiMenuParams()}`,
  );
  const all: any[] = data?.data ?? [];

  const desktopItems = all.filter(
    (i) => i.menu_type === "desktop" || i.menu_type === "both",
  );

  const ids = new Set(desktopItems.map((i) => i.id));

  desktopItems.forEach((item) => {
    if (item.parent && !ids.has(item.parent.id)) {
    }
  });
  const mobileItems = all.filter(
    (i) => i.menu_type === "mobile" || i.menu_type === "both",
  );

  const menu = buildDesktopMenu(desktopItems).filter(
    (m) => m.label !== "جستجو" && m.path !== "/search",
  );

  return {
    menu,
    mobileMenu: buildMobileMenu(mobileItems).filter(
      (m) => m.label !== "جستجو" && m.path !== "/search",
    ),
  };
};

export const useMenuQuery = () => {
  return useQuery<SiteMenu, Error>({
    queryKey: [API_ENDPOINTS.MENU_ITEMS],
    queryFn: fetchMenu,
  });
};
