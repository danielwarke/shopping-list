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
    mutationFn: (
      data: UpdateListItemDto & { id: string; appendName?: string },
    ) => {
      const { id, appendName, ...rest } = data;
      if (appendName) {
        rest.name = (rest.name || "") + appendName;
      }

      return apiClient.shoppingLists.listItemsControllerUpdate(
        shoppingListId,
        id,
        rest,
      );
    },
    onMutate: (data) => {
      const { id, appendName, ...rest } = data;
      let selection: number | undefined;
      if (appendName) {
        const originalName = rest.name || "";
        selection = originalName.length;
        rest.name = originalName + appendName;
      }

      setItemUpdateData(id, rest);
      return selection;
    },
    onSuccess: (_, data, selection) => {
      const el = document.getElementById(data.id) as HTMLInputElement | null;
      if (typeof data.header !== "undefined") {
        el?.focus();
      }

      if (typeof selection !== "undefined") {
        el?.focus();
        el?.setSelectionRange(selection, selection);
      }
    },
    onError: invalidateCache,
  });
}
