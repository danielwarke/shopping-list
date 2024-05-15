import { Box, Fab, Tooltip } from "@mui/material";
import { ListName } from "@/components/list-details/ListName";
import { DraggableItems } from "@/components/list-details/DraggableItems";
import { Add } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { AppendListItemDto } from "@/api/client-sdk/Api";
import { FC, useCallback } from "react";
import { useSetItemData } from "@/hooks/use-set-item-data";
import { getItemsQueryKey } from "@/api/query-keys";

interface ListDetailsProps {
  shoppingListId: string;
  shoppingListName: string;
}

export const ListDetails: FC<ListDetailsProps> = ({
  shoppingListId,
  shoppingListName,
}) => {
  const queryClient = useQueryClient();

  const { setItemAppendedData } = useSetItemData(shoppingListId);
  const itemsQueryKey = getItemsQueryKey(shoppingListId);

  const invalidateCache = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: itemsQueryKey,
    });
  }, [itemsQueryKey, queryClient]);

  const appendListItemMutation = useMutation({
    mutationFn: (data: AppendListItemDto) =>
      apiClient.shoppingLists.listItemsControllerAppend(shoppingListId, data),
    onSuccess: setItemAppendedData,
    onError: invalidateCache,
  });

  return (
    <>
      <ListName id={shoppingListId} currentName={shoppingListName} />
      <Box marginTop="2vh" paddingBottom="16vh">
        <DraggableItems shoppingListId={shoppingListId} />
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
