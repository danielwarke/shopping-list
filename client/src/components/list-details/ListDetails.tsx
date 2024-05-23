import { Box, Fab, Tooltip } from "@mui/material";
import { ListName } from "@/components/list-details/ListName";
import { DraggableItems } from "@/components/list-details/DraggableItems";
import { Add } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import {
  AppendListItemDto,
  InsertListItemDto,
  ListItem as ListItemDto,
} from "@/api/client-sdk/Api";
import { FC, useCallback } from "react";
import { useSetItemData } from "@/hooks/use-set-item-data";
import { getItemsQueryKey } from "@/api/query-keys";
import { useShoppingListContext } from "@/contexts/ShoppingListContext";
import { useAuthContext } from "@/contexts/AuthContext";

const tempPrefix = "optimistic";

export const ListDetails: FC = () => {
  const { userId } = useAuthContext();
  const { id: shoppingListId, colorId } = useShoppingListContext();
  const queryClient = useQueryClient();

  const { setItemData, setItemAppendedData } = useSetItemData(shoppingListId);
  const itemsQueryKey = getItemsQueryKey(shoppingListId);

  function invalidateCache() {
    queryClient.invalidateQueries({
      queryKey: itemsQueryKey,
    });
  }

  const getTempListItem = useCallback<() => ListItemDto | undefined>(() => {
    const listItems = queryClient.getQueryData<ListItemDto[]>(itemsQueryKey);
    if (!listItems) {
      return;
    }

    const tempId = tempPrefix + listItems.length;

    return {
      id: tempId,
      name: "",
      complete: false,
      header: false,
      sortOrder: -1,
      shoppingListId,
      createdAt: new Date().toISOString(),
      createdByUserId: userId,
    };
  }, [itemsQueryKey, queryClient, shoppingListId, userId]);

  const appendListItemMutation = useMutation({
    mutationFn: (data: AppendListItemDto) =>
      apiClient.shoppingLists.listItemsControllerAppend(shoppingListId, data),
    onMutate: () => {
      const tempListItem = getTempListItem();
      if (!tempListItem) {
        return;
      }

      setItemAppendedData(tempListItem);

      return tempListItem.id;
    },
    onSuccess: (createdListItem, _, tempId) => {
      setItemData((currentData) =>
        currentData.map((item) =>
          item.id === tempId ? createdListItem : item,
        ),
      );
    },
    onError: invalidateCache,
  });

  const insertListItemMutation = useMutation({
    mutationFn: (data: InsertListItemDto & { index: number }) =>
      apiClient.shoppingLists.listItemsControllerInsert(shoppingListId, data),
    onMutate: (data) => {
      const tempListItem = getTempListItem();
      if (!tempListItem) {
        return;
      }

      setItemData((currentData) => {
        const newData = [...currentData];
        newData.splice(data.index + 1, 0, tempListItem);
        return newData;
      });

      return tempListItem.id;
    },
    onSuccess: (createdListItem, _, tempId) => {
      setItemData((currentData) =>
        currentData.map((item) =>
          item.id === tempId ? createdListItem : item,
        ),
      );
    },
    onError: invalidateCache,
  });

  function validateAdd() {
    const listItems = queryClient.getQueryData<ListItemDto[]>(itemsQueryKey);
    if (listItems) {
      const tempExists = listItems.some(
        (item) => item.id === tempPrefix + listItems.length,
      );
      if (tempExists) {
        return false;
      }
    }

    return true;
  }

  function handleAppend() {
    if (validateAdd()) {
      appendListItemMutation.mutate({});
    }
  }

  function handleInsert(data: { sortOrder: number; index: number }) {
    if (validateAdd()) {
      insertListItemMutation.mutate(data);
    }
  }

  return (
    <>
      <ListName />
      <Box marginTop="2vh" paddingBottom="16vh">
        <DraggableItems
          appendListItem={handleAppend}
          insertListItem={handleInsert}
        />
      </Box>
      <Tooltip title="New List Item">
        <Fab
          color={colorId ? "default" : "primary"}
          sx={{ position: "fixed", bottom: "2em", right: "2em" }}
          onClick={handleAppend}
        >
          <Add />
        </Fab>
      </Tooltip>
    </>
  );
};
