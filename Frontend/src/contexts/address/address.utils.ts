export interface AddressItem {
  id: string;
  label?: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  isDefault?: boolean;
}

export function addItem(items: AddressItem[], item: AddressItem) {
  return [...items, item];
}

export function updateItem(items: AddressItem[], id: string, updates: Partial<AddressItem>) {
  return items.map((item) => (item.id === id ? { ...item, ...updates } : item));
}

export function removeItem(items: AddressItem[], id: string) {
  return items.filter((item) => item.id !== id);
}

export function getItem(items: AddressItem[], id: string) {
  return items.find((item) => item.id === id);
}
