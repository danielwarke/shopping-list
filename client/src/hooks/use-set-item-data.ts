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

  const setItemRenameData = useCallback(
    (itemId: string, name: string) => {
      setItemData((currentData) =>
        currentData.map((item) =>
          item.id === itemId ? { ...item, name } : item,
        ),
      );
    },
    [setItemData],
  );

  const setItemCompleteData = useCallback(
    (itemId: string, complete: boolean) => {
      setItemData((currentData) =>
        currentData.map((item) =>
          item.id === itemId ? { ...item, complete } : item,
        ),
      );
    },
    [setItemData],
  );

  const setItemDeleteData = useCallback(
    (itemId: string) => {
      setItemData((currentData) =>
        currentData.filter((item) => item.id !== itemId),
      );
    },
    [setItemData],
  );

  return {
    setItemData,
    setItemDeleteData,
    setItemRenameData,
    setItemCompleteData,
  };
}
