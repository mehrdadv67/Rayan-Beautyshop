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

  console.log("Total:", all.length);

  console.log(
    all.map((i) => ({
      id: i.id,
      label: i.label,
      parent: i.parent?.label ?? null,
    })),
  );

  const desktopItems = all.filter(
    (i) => i.menu_type === "desktop" || i.menu_type === "both",
  );

  const ids = new Set(desktopItems.map((i) => i.id));

  desktopItems.forEach((item) => {
    if (item.parent && !ids.has(item.parent.id)) {
      console.log(
        "Missing parent:",
        item.label,
        "parent id:",
        item.parent.id,
        "parent label:",
        item.parent.label,
      );
    }
  });
  const mobileItems = all.filter(
    (i) => i.menu_type === "mobile" || i.menu_type === "both",
  );

  const menu = buildDesktopMenu(desktopItems);

  console.log(
    menu.map((m) => ({
      label: m.label,
      columns: m.columns.length,
      children: m.columns.flatMap((c) => c.columnItems).length,
    })),
  );
  console.log("Top level count:", menu.length);

  return {
    menu: buildDesktopMenu(desktopItems),
    mobileMenu: buildMobileMenu(mobileItems),
  };
};

export const useMenuQuery = () => {
  return useQuery<SiteMenu, Error>({
    queryKey: [API_ENDPOINTS.MENU_ITEMS],
    queryFn: fetchMenu,
  });
};
