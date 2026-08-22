import { QueryOptionsType, FooterMenu } from "@framework/types";
import { API_ENDPOINTS, strapiFooterMenuParams } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeFooterMenu, unwrapList } from "@framework/utils/normalize";
import { useQuery } from "@tanstack/react-query";

export const fetchFooterMenus = async () => {
  const { data } = await http.get(
    `${API_ENDPOINTS.FOOTER_MENUS}${strapiFooterMenuParams()}`,
  );
  const items = unwrapList(data, normalizeFooterMenu) as FooterMenu[];
  const topLevel = items.filter((item) => !item.parent);
  topLevel.sort((a, b) => a.priority - b.priority);
  return topLevel;
};

export const useFooterMenusQuery = (options?: QueryOptionsType) => {
  return useQuery<FooterMenu[], Error>({
    queryKey: [API_ENDPOINTS.FOOTER_MENUS, options],
    queryFn: fetchFooterMenus,
  });
};
