import { Box, Fab, Tooltip } from "@mui/material";
import { ListName } from "@/components/list-details/ListName";
import { DraggableItems } from "@/components/list-details/DraggableItems";
import { Add } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import {
  AppendListItemDto,
  ListItem as ListItemDto,
} from "@/api/client-sdk/Api";
import { FC } from "react";
import { useSetItemData } from "@/hooks/use-set-item-data";
import { getItemsQueryKey } from "@/api/query-keys";
import { useShoppingListContext } from "@/contexts/ShoppingListContext";

export const ListDetails: FC = () => {
  const { id: shoppingListId, colorId } = useShoppingListContext();
  const queryClient = useQueryClient();

  const { setItemData, setItemAppendedData } = useSetItemData(shoppingListId);
  const itemsQueryKey = getItemsQueryKey(shoppingListId);

  const appendListItemMutation = useMutation({
    mutationFn: (data: AppendListItemDto) =>
      apiClient.shoppingLists.listItemsControllerAppend(shoppingListId, data),
    onMutate: () => {
      const listItems = queryClient.getQueryData<ListItemDto[]>(itemsQueryKey);
      const tempId = `optimistic-append-${listItems ? listItems.length : 0}`;

      setItemAppendedData({
        id: tempId,
        name: "",
        complete: false,
        header: false,
        sortOrder: -1,
        shoppingListId,
        createdAt: new Date().toISOString(),
      });

      return tempId;
    },
    onSuccess: (createdListItem, _, tempId) => {
      setItemData((currentData) =>
        currentData.map((item) =>
          item.id === tempId ? createdListItem : item,
        ),
      );
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: itemsQueryKey,
      });
    },
  });

  return (
    <>
      <ListName />
      <Box marginTop="2vh" paddingBottom="16vh">
        <DraggableItems
          appendListItem={() => appendListItemMutation.mutate({})}
        />
      </Box>
      <Tooltip title="New List Item">
        <Fab
          color={colorId ? "default" : "primary"}
          sx={{ position: "fixed", bottom: "2em", right: "2em" }}
          onClick={() => appendListItemMutation.mutate({})}
        >
          <Add />
        </Fab>
      </Tooltip>
    </>
  );
};
