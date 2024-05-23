import { useQueryClient } from "@tanstack/react-query";
import { getItemsQueryKey } from "@/api/query-keys";
import { ListItem } from "@/api/client-sdk/Api";
import { useCallback } from "react";

export function useSetItemData(shoppingListId: string) {
  const queryClient = useQueryClient();
  const itemsQueryKey = getItemsQueryKey(shoppingListId);

  const setItemData = useCallback(
    (updater: ListItem[] | ((currentData: ListItem[]) => ListItem[])) => {
      queryClient.setQueryData<ListItem[]>(itemsQueryKey, (currentData) => {
        if (typeof updater !== "function") {
          return updater;
        }

        if (!currentData) {
          return [];
        }

        return updater(currentData);
      });
    },
    [itemsQueryKey, queryClient],
  );

  const setItemAppendedData = useCallback(
    (createdItem: ListItem) => {
      setItemData((currentData) => {
        return [...currentData, createdItem];
      });
    },
    [setItemData],
  );

  const setItemUpdateData = useCallback(
    (
      itemId: string,
      data: Partial<Omit<ListItem, "id" | "createdByUserId">>,
    ) => {
      setItemData((currentData) =>
        currentData.map((item) =>
          item.id === itemId ? { ...item, ...data } : item,
        ),
      );
    },
    [setItemData],
  );

  const setItemDeleteData = useCallback(
    (deletedItemIds: string[]) => {
      setItemData((currentData) =>
        currentData.filter((item) => !deletedItemIds.includes(item.id)),
      );
    },
    [setItemData],
  );

  return {
    setItemData,
    setItemAppendedData,
    setItemUpdateData,
    setItemDeleteData,
  };
}
