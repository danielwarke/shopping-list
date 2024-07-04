import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { generateListItem, useInvalidateListItemsCache } from "./utils";
import { useShoppingListContext } from "@/contexts/ShoppingListContext";
import { useSetItemData } from "@/hooks/use-set-item-data";
import { useAuthContext } from "@/contexts/AuthContext";

export function useAppendListItemMutation() {
  const { userId } = useAuthContext();
  const { id: shoppingListId } = useShoppingListContext();
  const { setItemAppendedData, setItemUpdateData } =
    useSetItemData(shoppingListId);
  const invalidateCache = useInvalidateListItemsCache(shoppingListId);

  return useMutation({
    mutationFn: (data: { id: string }) =>
      apiClient.shoppingLists.listItemsControllerAppend(shoppingListId, data),
    onMutate: (data) => {
      const listItem = generateListItem(data.id, userId, shoppingListId);
      setItemAppendedData(listItem);
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
