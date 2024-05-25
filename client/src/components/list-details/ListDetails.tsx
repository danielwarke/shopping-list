import { Box } from "@mui/material";
import { ListName } from "@/components/list-details/ListName";
import { DraggableItems } from "@/components/list-details/DraggableItems";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { ListItem as ListItemDto } from "@/api/client-sdk/Api";
import { FC } from "react";
import { useSetItemData } from "@/hooks/use-set-item-data";
import { getItemsQueryKey } from "@/api/query-keys";
import { useShoppingListContext } from "@/contexts/ShoppingListContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { createId } from "@paralleldrive/cuid2";

const generateListItem = (
  id: string,
  userId: string,
  shoppingListId: string,
): ListItemDto => {
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
};

export const ListDetails: FC = () => {
  const { userId } = useAuthContext();
  const { id: shoppingListId } = useShoppingListContext();
  const queryClient = useQueryClient();

  const { setItemData, setItemAppendedData, setItemUpdateData } =
    useSetItemData(shoppingListId);
  const itemsQueryKey = getItemsQueryKey(shoppingListId);

  function invalidateCache() {
    queryClient.invalidateQueries({
      queryKey: itemsQueryKey,
    });
  }

  const appendListItemMutation = useMutation({
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

  const insertListItemMutation = useMutation({
    mutationFn: (data: { id: string; sortOrder: number; index: number }) =>
      apiClient.shoppingLists.listItemsControllerInsert(shoppingListId, data),
    onMutate: (data) => {
      const listItem = generateListItem(data.id, userId, shoppingListId);

      setItemData((currentData) => {
        const newData = [...currentData];
        newData.splice(data.index + 1, 0, listItem);
        return newData;
      });
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

  function handleAppend() {
    appendListItemMutation.mutate({
      id: createId(),
    });
  }

  function handleInsert(data: { sortOrder: number; index: number }) {
    insertListItemMutation.mutate({ ...data, id: createId() });
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
    </>
  );
};
