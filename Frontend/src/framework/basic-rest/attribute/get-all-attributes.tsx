import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";

export interface AttributeValue {
  id: number;
  title: string;
}

export interface AttributeWithValues {
  id: number;
  title: string;
  values: AttributeValue[];
}

/** Fetch product attributes (e.g. جنس، رنگ، سایز) with their available values. */
const fetchAttributes = async (): Promise<AttributeWithValues[]> => {
  const { data } = await http.get(
    `${API_ENDPOINTS.ATTRIBUTES}?populate[0]=attribute_values&pagination[pageSize]=100`
  );
  const list = Array.isArray(data?.data) ? data.data : [];
  return list
    .map((item: any) => ({
      id: item.id,
      title: item.title ?? item.name ?? "",
      values: (
        Array.isArray(item.attribute_values) ? item.attribute_values : []
      )
        .map((v: any) => ({ id: v.id, title: v.title ?? v.value ?? "" }))
        .filter((v: AttributeValue) => v.id != null),
    }))
    .filter((a: AttributeWithValues) => a.title && a.values.length > 0);
};

export const useAttributesQuery = () => {
  return useQuery({
    queryKey: ["attributes"],
    queryFn: fetchAttributes,
    staleTime: 5 * 60 * 1000,
  });
};

export { fetchAttributes };
