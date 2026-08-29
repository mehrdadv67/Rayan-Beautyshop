export interface CompareItem {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  slug?: string;
  description?: string;
  category?: string;
  rating?: number;
  [key: string]: any;
}

export function addItem(items: CompareItem[], item: CompareItem) {
  if (getItem(items, item.id)) return items;
  if (items.length >= 4) return items; // Max 4 items for comparison
  return [...items, item];
}

export function removeItem(items: CompareItem[], id: CompareItem["id"]) {
  return items.filter((item) => item.id !== id);
}

export function getItem(items: CompareItem[], id: CompareItem["id"]) {
  return items.find((item) => item.id === id);
}

export function isInCompare(items: CompareItem[], id: CompareItem["id"]) {
  return !!getItem(items, id);
}
