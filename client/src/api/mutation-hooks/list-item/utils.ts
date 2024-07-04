import { ListItem as ListItemDto } from "@/api/client-sdk/Api";
import { useQueryClient } from "@tanstack/react-query";
import { getItemsQueryKey } from "@/api/query-keys";

export function generateListItem(
  id: string,
  userId: string,
  shoppingListId: string,
): ListItemDto {
  return {
    id,
    name: "",
    complete: false,
    header: false,
    sortOrder: -1,
    shoppingListId,
    createdAt: new Date().toISOString(),
    createdByUserId: userId,
  };
}

export function useInvalidateListItemsCache(shoppingListId: string) {
  const queryClient = useQueryClient();
  const itemsQueryKey = getItemsQueryKey(shoppingListId);
  return () => {
    return queryClient.invalidateQueries({
      queryKey: itemsQueryKey,
    });
  };
}
