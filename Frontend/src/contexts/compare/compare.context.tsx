import React from "react";
import { compareReducer, State, initialState } from "./compare.reducer";
import { getItem, isInCompare, CompareItem } from "./compare.utils";
import { useLocalStorage } from "@utils/use-local-storage";

interface CompareProviderState extends State {
  addToCompare: (item: CompareItem) => void;
  removeFromCompare: (id: CompareItem["id"]) => void;
  resetCompare: () => void;
  getItemFromCompare: (id: CompareItem["id"]) => any | undefined;
  isInCompare: (id: CompareItem["id"]) => boolean;
}

export const compareContext = React.createContext<CompareProviderState | undefined>(
  undefined
);

compareContext.displayName = "CompareContext";

export const useCompare = () => {
  const context = React.useContext(compareContext);
  if (context === undefined) {
    throw new Error(`useCompare must be used within a CompareProvider`);
  }
  return context;
};

export const CompareProvider: React.FC = (props) => {
  const [savedCompare, saveCompare] = useLocalStorage(
    `chawkbazar-compare`,
    JSON.stringify(initialState)
  );
  const [state, dispatch] = React.useReducer(
    compareReducer,
    JSON.parse(savedCompare!)
  );

  React.useEffect(() => {
    saveCompare(JSON.stringify(state));
  }, [state, saveCompare]);

  const addToCompare = (item: CompareItem) =>
    dispatch({ type: "ADD_ITEM", item });
  const removeFromCompare = (id: CompareItem["id"]) =>
    dispatch({ type: "REMOVE_ITEM", id });
  const resetCompare = () => dispatch({ type: "RESET_COMPARE" });
  const getItemFromCompare = (id: CompareItem["id"]) => getItem(state.items, id);
  const isInCompareItem = (id: CompareItem["id"]) =>
    isInCompare(state.items, id);

  const value = React.useMemo(
    () => ({
      ...state,
      addToCompare,
      removeFromCompare,
      resetCompare,
      getItemFromCompare,
      isInCompare: isInCompareItem,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  );
  return <compareContext.Provider value={value} {...props} />;
};
