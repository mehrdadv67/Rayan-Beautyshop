import React from "react";
import { addressReducer, State, initialState } from "./address.reducer";
import { getItem, AddressItem } from "./address.utils";
import { useLocalStorage } from "@utils/use-local-storage";

interface AddressProviderState extends State {
  addAddress: (item: AddressItem) => void;
  updateAddress: (id: string, updates: Partial<AddressItem>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  resetAddresses: () => void;
  getAddressById: (id: string) => any | undefined;
}

export const addressContext = React.createContext<AddressProviderState | undefined>(
  undefined
);

addressContext.displayName = "AddressContext";

export const useAddress = () => {
  const context = React.useContext(addressContext);
  if (context === undefined) {
    throw new Error(`useAddress must be used within an AddressProvider`);
  }
  return context;
};

export const AddressProvider: React.FC = (props) => {
  const [savedAddresses, saveAddresses] = useLocalStorage(
    `chawkbazar-addresses`,
    JSON.stringify(initialState)
  );
  const [state, dispatch] = React.useReducer(
    addressReducer,
    JSON.parse(savedAddresses!)
  );

  React.useEffect(() => {
    saveAddresses(JSON.stringify(state));
  }, [state, saveAddresses]);

  const addAddress = (item: AddressItem) =>
    dispatch({ type: "ADD_ITEM", item });
  const updateAddress = (id: string, updates: Partial<AddressItem>) =>
    dispatch({ type: "UPDATE_ITEM", id, updates });
  const removeAddress = (id: string) =>
    dispatch({ type: "REMOVE_ITEM", id });
  const setDefaultAddress = (id: string) =>
    dispatch({ type: "SET_DEFAULT", id });
  const resetAddresses = () => dispatch({ type: "RESET_ADDRESSES" });
  const getAddressById = (id: string) => getItem(state.items, id);

  const value = React.useMemo(
    () => ({
      ...state,
      addAddress,
      updateAddress,
      removeAddress,
      setDefaultAddress,
      resetAddresses,
      getAddressById,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  );
  return <addressContext.Provider value={value} {...props} />;
};
