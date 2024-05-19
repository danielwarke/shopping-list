import { FC, KeyboardEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ListItem as ListItemInterface,
  RenameListItemDto,
  SetListItemCompleteDto,
} from "@/api/client-sdk/Api";
import { apiClient } from "@/api/api-client";
import { useDebounceState } from "@/hooks/use-debounce-state";
import { Checkbox, IconButton, InputAdornment, TextField } from "@mui/material";
import { Clear, DragIndicator } from "@mui/icons-material";
import { Draggable } from "react-smooth-dnd";
import { getItemsQueryKey } from "@/api/query-keys";
import { useSetItemData } from "@/hooks/use-set-item-data";
import { useShoppingListContext } from "@/contexts/ShoppingListContext";

interface ListItemProps {
  listItem: ListItemInterface;
  onEnterKey: () => void;
  autoFocus: boolean;
  disableDrag?: boolean;
}

export const ListItem: FC<ListItemProps> = ({
  listItem,
  onEnterKey,
  autoFocus,
  disableDrag,
}) => {
  const listItemId = listItem.id;
  const shoppingListId = listItem.shoppingListId;
  const { colorId } = useShoppingListContext();

  const queryClient = useQueryClient();
  const itemsQueryKey = getItemsQueryKey(shoppingListId);
  const { setItemDeleteData, setItemCompleteData } =
    useSetItemData(shoppingListId);

  function invalidateCache() {
    return queryClient.invalidateQueries({
      queryKey: itemsQueryKey,
    });
  }

  const renameListItemMutation = useMutation({
    mutationFn: (data: RenameListItemDto) =>
      apiClient.shoppingLists.listItemsControllerRename(
        shoppingListId,
        listItemId,
        data,
      ),
    onError: invalidateCache,
  });

  const setCompleteMutation = useMutation({
    mutationFn: (data: SetListItemCompleteDto) =>
      apiClient.shoppingLists.listItemsControllerSetComplete(
        shoppingListId,
        listItemId,
        data,
      ),
    onSuccess: (item) => setItemCompleteData(item.id, item.complete),
    onError: invalidateCache,
  });

  const deleteListItemMutation = useMutation({
    mutationFn: () =>
      apiClient.shoppingLists.listItemsControllerRemove(
        shoppingListId,
        listItemId,
      ),
    onSuccess: (deletedListItem) => {
      setItemDeleteData([deletedListItem.id]);
    },
    onError: invalidateCache,
  });

  const [name, setName] = useDebounceState(listItem.name, (newName) => {
    if (newName !== listItem.name) {
      renameListItemMutation.mutate({ name: newName });
    }
  });

  async function handleKeyDown(e: KeyboardEvent) {
    if (e.code === "Enter") {
      if (name !== listItem.name) {
        await renameListItemMutation.mutateAsync({ name });
      }

      onEnterKey();
    }

    if (e.code === "Backspace" && name === "") {
      deleteListItemMutation.mutate();
    }
  }

  return (
    // @ts-ignore
    <Draggable key={listItemId}>
      <TextField
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        placeholder="List item"
        fullWidth
        sx={{
          marginTop: "1em",
        }}
        variant="standard"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {!disableDrag && (
                <DragIndicator
                  className="drag-handle"
                  sx={{ cursor: "grab", padding: "6px" }}
                  onClick={(e) => e.preventDefault()}
                />
              )}
              <Checkbox
                checked={listItem.complete}
                onChange={(e) =>
                  setCompleteMutation.mutate({ complete: e.target.checked })
                }
                color={colorId ? "default" : "primary"}
              />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => deleteListItemMutation.mutate()}>
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
          ...(listItem.complete && {
            sx: {
              textDecoration: "line-through",
              color: "gray",
            },
          }),
          disableUnderline: !!colorId,
        }}
      />
    </Draggable>
  );
};
