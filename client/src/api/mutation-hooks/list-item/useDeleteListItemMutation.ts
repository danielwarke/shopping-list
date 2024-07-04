import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { useShoppingListContext } from "@/contexts/ShoppingListContext";
import { useSetItemData } from "@/hooks/use-set-item-data";
import { useInvalidateListItemsCache } from "./utils";

export function useDeleteListItemMutation(
  onMutate: (fromKeyboard: boolean) => void,
) {
  const { id: shoppingListId } = useShoppingListContext();
  const { setItemDeleteData } = useSetItemData(shoppingListId);
  const invalidateCache = useInvalidateListItemsCache(shoppingListId);

  return useMutation({
    mutationFn: (data: { id: string; fromKeyboard: boolean }) =>
      apiClient.shoppingLists.listItemsControllerRemove(
        shoppingListId,
        data.id,
      ),
    onMutate: (data) => {
      onMutate(data.fromKeyboard);
      setItemDeleteData([data.id]);
    },
    onError: invalidateCache,
  });
}
