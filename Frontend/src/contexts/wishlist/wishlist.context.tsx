import React from "react";
import { wishlistReducer, State, initialState } from "./wishlist.reducer";
import { getItem, isInWishlist, WishlistItem } from "./wishlist.utils";
import { useLocalStorage } from "@utils/use-local-storage";

interface WishlistProviderState extends State {
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: WishlistItem["id"]) => void;
  resetWishlist: () => void;
  getItemFromWishlist: (id: WishlistItem["id"]) => any | undefined;
  isInWishlist: (id: WishlistItem["id"]) => boolean;
}

export const wishlistContext = React.createContext<WishlistProviderState | undefined>(
  undefined
);

wishlistContext.displayName = "WishlistContext";

export const useWishlist = () => {
  const context = React.useContext(wishlistContext);
  if (context === undefined) {
    throw new Error(`useWishlist must be used within a WishlistProvider`);
  }
  return context;
};

export const WishlistProvider: React.FC = (props) => {
  const [savedWishlist, saveWishlist] = useLocalStorage(
    `chawkbazar-wishlist`,
    JSON.stringify(initialState)
  );
  const [state, dispatch] = React.useReducer(
    wishlistReducer,
    JSON.parse(savedWishlist!)
  );

  React.useEffect(() => {
    saveWishlist(JSON.stringify(state));
  }, [state, saveWishlist]);

  const addToWishlist = (item: WishlistItem) =>
    dispatch({ type: "ADD_ITEM", item });
  const removeFromWishlist = (id: WishlistItem["id"]) =>
    dispatch({ type: "REMOVE_ITEM", id });
  const resetWishlist = () => dispatch({ type: "RESET_WISHLIST" });
  const getItemFromWishlist = (id: WishlistItem["id"]) => getItem(state.items, id);
  const isInWishlistItem = (id: WishlistItem["id"]) =>
    isInWishlist(state.items, id);

  const value = React.useMemo(
    () => ({
      ...state,
      addToWishlist,
      removeFromWishlist,
      resetWishlist,
      getItemFromWishlist,
      isInWishlist: isInWishlistItem,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  );
  return <wishlistContext.Provider value={value} {...props} />;
};
