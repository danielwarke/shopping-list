import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
} from "react";
import { ShoppingListWithMetadata } from "@/api/client-sdk/Api";
import { useSocket } from "@/hooks/use-socket";
import { useAuth } from "@/hooks/use-auth";

type ListDetails = ShoppingListWithMetadata & { shared?: "self" | "other" };

const emptyList: ListDetails = {
  id: "",
  name: "",
  createdByUserId: "",
  createdAt: "",
  isShared: false,
};

export const ShoppingListContext = createContext<ListDetails>(emptyList);

interface ShoppingListContextProviderProps {
  shoppingList: ListDetails | undefined;
}

const ShoppingListContextProvider: FC<
  PropsWithChildren & ShoppingListContextProviderProps
> = ({ children, shoppingList }) => {
  const { userId } = useAuth(false);
  useSocket(shoppingList?.isShared ? shoppingList.id : undefined);

  const shared = useMemo(() => {
    if (!shoppingList?.isShared) {
      return;
    }

    return shoppingList.createdByUserId === userId ? "self" : "other";
  }, [shoppingList?.createdByUserId, shoppingList?.isShared, userId]);

  return (
    <ShoppingListContext.Provider
      value={shoppingList ? { ...shoppingList, shared } : emptyList}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

export function useShoppingListContext() {
  return useContext(ShoppingListContext);
}

export default ShoppingListContextProvider;