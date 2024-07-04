import { useAuthContext } from "@/contexts/AuthContext";
import { useShoppingListContext } from "@/contexts/ShoppingListContext";
import { useSetItemData } from "@/hooks/use-set-item-data";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { generateListItem, useInvalidateListItemsCache } from "./utils";

export function useInsertListItemMutation() {
  const { userId } = useAuthContext();
  const { id: shoppingListId } = useShoppingListContext();
  const { setItemUpdateData, setItemData } = useSetItemData(shoppingListId);
  const invalidateCache = useInvalidateListItemsCache(shoppingListId);

  return useMutation({
    mutationFn: (data: {
      id: string;
      name?: string;
      sortOrder: number;
      index: number;
    }) =>
      apiClient.shoppingLists.listItemsControllerInsert(shoppingListId, data),
    onMutate: (data) => {
      const listItem = generateListItem(data.id, userId, shoppingListId);
      if (data.name) {
        listItem.name = data.name;
      }

      setItemData((currentData) => {
        const newData = [...currentData];
        newData.splice(data.index + 1, 0, listItem);
        return newData;
      });

      setTimeout(() => document.getElementById(data.id)?.focus());
    },
    onSuccess: (createdListItem) => {
      setItemUpdateData(createdListItem.id, {
        sortOrder: createdListItem.sortOrder,
        createdAt: createdListItem.createdAt,
      });
    },
    onError: invalidateCache,
  });
}
