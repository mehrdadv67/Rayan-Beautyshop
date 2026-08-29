import {
  WishlistItem,
  addItem,
  removeItem,
  getItem,
  isInWishlist,
} from "./wishlist.utils";

export interface State {
  items: WishlistItem[];
  isEmpty: boolean;
  totalItems: number;
}

export const initialState: State = {
  items: [],
  isEmpty: true,
  totalItems: 0,
};

type Action =
  | { type: "ADD_ITEM"; item: WishlistItem }
  | { type: "REMOVE_ITEM"; id: WishlistItem["id"] }
  | { type: "RESET_WISHLIST" };

export function wishlistReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_ITEM": {
      const items = addItem(state.items, action.item);
      return {
        ...state,
        items,
        totalItems: items.length,
        isEmpty: items.length === 0,
      };
    }
    case "REMOVE_ITEM": {
      const items = removeItem(state.items, action.id);
      return {
        ...state,
        items,
        totalItems: items.length,
        isEmpty: items.length === 0,
      };
    }
    case "RESET_WISHLIST":
      return initialState;
    default:
      return state;
  }
}
