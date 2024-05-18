import { Box, Fab, Tooltip } from "@mui/material";
import { ListName } from "@/components/list-details/ListName";
import { DraggableItems } from "@/components/list-details/DraggableItems";
import { Add } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { AppendListItemDto } from "@/api/client-sdk/Api";
import { FC } from "react";
import { useSetItemData } from "@/hooks/use-set-item-data";
import { getItemsQueryKey } from "@/api/query-keys";
import { useShoppingListContext } from "@/contexts/ShoppingListContext";

export const ListDetails: FC = () => {
  const { id: shoppingListId } = useShoppingListContext();
  const queryClient = useQueryClient();

  const { setItemAppendedData } = useSetItemData(shoppingListId);
  const itemsQueryKey = getItemsQueryKey(shoppingListId);

  const appendListItemMutation = useMutation({
    mutationFn: (data: AppendListItemDto) =>
      apiClient.shoppingLists.listItemsControllerAppend(shoppingListId, data),
    onSuccess: setItemAppendedData,
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
        <DraggableItems />
      </Box>
      <Tooltip title="New List Item">
        <Fab
          color="primary"
          sx={{ position: "fixed", bottom: "2em", right: "2em" }}
          onClick={() => appendListItemMutation.mutate({})}
        >
          <Add />
        </Fab>
      </Tooltip>
    </>
  );
};
