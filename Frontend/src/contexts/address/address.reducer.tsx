import {
  AddressItem,
  addItem,
  updateItem,
  removeItem,
  getItem,
} from "./address.utils";

export interface State {
  items: AddressItem[];
  isEmpty: boolean;
  totalItems: number;
}

export const initialState: State = {
  items: [],
  isEmpty: true,
  totalItems: 0,
};

type Action =
  | { type: "ADD_ITEM"; item: AddressItem }
  | { type: "UPDATE_ITEM"; id: string; updates: Partial<AddressItem> }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "SET_DEFAULT"; id: string }
  | { type: "RESET_ADDRESSES" };

export function addressReducer(state: State, action: Action): State {
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
    case "UPDATE_ITEM": {
      const items = updateItem(state.items, action.id, action.updates);
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
    case "SET_DEFAULT": {
      const items = state.items.map((item) => ({
        ...item,
        isDefault: item.id === action.id,
      }));
      return {
        ...state,
        items,
        totalItems: items.length,
        isEmpty: items.length === 0,
      };
    }
    case "RESET_ADDRESSES":
      return initialState;
    default:
      return state;
  }
}
