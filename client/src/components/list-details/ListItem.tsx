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
import { Clear, DragHandle } from "@mui/icons-material";
import { Draggable } from "react-smooth-dnd";
import { getItemsQueryKey } from "@/api/query-keys";
import { useSetItemData } from "@/hooks/use-set-item-data";

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

  const queryClient = useQueryClient();
  const itemsQueryKey = getItemsQueryKey(shoppingListId);
  const { setItemDeleteData } = useSetItemData(shoppingListId);

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

  const [complete, setComplete] = useDebounceState(
    listItem.complete,
    (newComplete) => setCompleteMutation.mutate({ complete: newComplete }),
  );

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
                <DragHandle
                  className="drag-handle"
                  sx={{ cursor: "grab" }}
                  onClick={(e) => e.preventDefault()}
                />
              )}
              <Checkbox
                checked={complete}
                onChange={(e) => setComplete(e.target.checked)}
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
          ...(complete && {
            sx: {
              textDecoration: "line-through",
              color: "gray",
            },
          }),
        }}
      />
    </Draggable>
  );
};
