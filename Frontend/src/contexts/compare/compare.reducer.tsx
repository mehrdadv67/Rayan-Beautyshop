import {
  CompareItem,
  addItem,
  removeItem,
  getItem,
  isInCompare,
} from "./compare.utils";

export interface State {
  items: CompareItem[];
  isEmpty: boolean;
  totalItems: number;
}

export const initialState: State = {
  items: [],
  isEmpty: true,
  totalItems: 0,
};

type Action =
  | { type: "ADD_ITEM"; item: CompareItem }
  | { type: "REMOVE_ITEM"; id: CompareItem["id"] }
  | { type: "RESET_COMPARE" };

export function compareReducer(state: State, action: Action): State {
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
    case "RESET_COMPARE":
      return initialState;
    default:
      return state;
  }
}
