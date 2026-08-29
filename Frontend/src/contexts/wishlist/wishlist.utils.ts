export interface WishlistItem {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  slug?: string;
  [key: string]: any;
}

export function addItem(items: WishlistItem[], item: WishlistItem) {
  if (getItem(items, item.id)) return items;
  return [...items, item];
}

export function removeItem(items: WishlistItem[], id: WishlistItem["id"]) {
  return items.filter((item) => item.id !== id);
}

export function getItem(items: WishlistItem[], id: WishlistItem["id"]) {
  return items.find((item) => item.id === id);
}

export function isInWishlist(items: WishlistItem[], id: WishlistItem["id"]) {
  return !!getItem(items, id);
}
