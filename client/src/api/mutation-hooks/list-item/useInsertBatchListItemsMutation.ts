import { useMutation } from "@tanstack/react-query";
import { InsertBatchListItemsDto } from "@/api/client-sdk/Api";
import { apiClient } from "@/api/api-client";
import { useShoppingListContext } from "@/contexts/ShoppingListContext";
import { useSetItemData } from "@/hooks/use-set-item-data";
import { useInvalidateListItemsCache } from "@/api/mutation-hooks/list-item/utils";

export function useInsertBatchListItemsMutation() {
  const { id: shoppingListId } = useShoppingListContext();
  const { setItemData } = useSetItemData(shoppingListId);
  const invalidateCache = useInvalidateListItemsCache(shoppingListId);

  return useMutation({
    mutationFn: (data: InsertBatchListItemsDto) =>
      apiClient.shoppingLists.listItemsControllerInsertBatch(
        shoppingListId,
        data,
      ),
    onSuccess: (items) => {
      setItemData(items);
      let newestItem = items[0];
      for (const item of items) {
        if (item.createdAt > newestItem.createdAt) {
          newestItem = item;
        }
      }

      setTimeout(() => document.getElementById(newestItem.id)?.focus());
    },
    onError: invalidateCache,
  });
}
