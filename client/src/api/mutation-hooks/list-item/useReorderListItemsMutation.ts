import { useMutation } from "@tanstack/react-query";
import { ReorderShoppingListDto } from "@/api/client-sdk/Api";
import { apiClient } from "@/api/api-client";
import { useShoppingListContext } from "@/contexts/ShoppingListContext";
import { useInvalidateListItemsCache } from "@/api/mutation-hooks/list-item/utils";

export function useReorderListItemsMutation() {
  const { id: shoppingListId } = useShoppingListContext();
  const invalidateCache = useInvalidateListItemsCache(shoppingListId);

  return useMutation({
    mutationFn: (data: ReorderShoppingListDto) =>
      apiClient.shoppingLists.listItemsControllerReorder(shoppingListId, data),
    onError: invalidateCache,
  });
}
