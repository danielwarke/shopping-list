import { FC, KeyboardEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ListItem,
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

interface ShoppingListItemProps {
  shoppingListId: string;
  listItem: ListItem;
  onEnterKey: (sortOrder: number) => void;
  autoFocus: boolean;
  disableDrag?: boolean;
}

export const ShoppingListItem: FC<ShoppingListItemProps> = ({
  shoppingListId,
  listItem,
  onEnterKey,
  autoFocus,
  disableDrag,
}) => {
  const queryClient = useQueryClient();
  const itemsQueryKey = getItemsQueryKey(shoppingListId);
  const listItemId = listItem.id;
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
      setItemDeleteData(deletedListItem.id);
    },
    onError: invalidateCache,
  });

  const [name, setName] = useDebounceState(listItem.name, (newName) => {
    renameListItemMutation.mutate({ name: newName });
  });

  const [complete, setComplete] = useDebounceState(
    listItem.complete,
    (newComplete) => setCompleteMutation.mutate({ complete: newComplete }),
  );

  function handleKeyDown(e: KeyboardEvent) {
    if (e.code === "Enter") {
      onEnterKey(listItem.sortOrder);
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
        disabled={complete}
        autoFocus={autoFocus}
        placeholder="List item"
        fullWidth
        sx={{
          marginTop: "1em",
          ...(complete && { textDecoration: "line-through" }),
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
        }}
      />
    </Draggable>
  );
};
