import { useMutation } from "@tanstack/react-query";
import { UpdateListItemDto } from "@/api/client-sdk/Api";
import { apiClient } from "@/api/api-client";
import { useShoppingListContext } from "@/contexts/ShoppingListContext";
import { useSetItemData } from "@/hooks/use-set-item-data";
import { useInvalidateListItemsCache } from "./utils";

export function useUpdateListItemMutation() {
  const { id: shoppingListId } = useShoppingListContext();
  const { setItemUpdateData } = useSetItemData(shoppingListId);
  const invalidateCache = useInvalidateListItemsCache(shoppingListId);

  return useMutation({
    mutationFn: (data: UpdateListItemDto & { id: string }) => {
      const { id, ...rest } = data;
      return apiClient.shoppingLists.listItemsControllerUpdate(
        shoppingListId,
        id,
        rest,
      );
    },
    onMutate: (data) => {
      const { id, ...rest } = data;
      if (typeof rest.name === "undefined") {
        setItemUpdateData(id, data);
      }
    },
    onSuccess: (_, data) => {
      if (typeof data.header !== "undefined") {
        document.getElementById(data.id)?.focus();
      }
    },
    onError: invalidateCache,
  });
}
