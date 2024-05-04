import { ChangeEvent, FC, KeyboardEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ListItem, RenameListItemDto } from "@/api/client-sdk/Api";
import { apiClient } from "@/api/api-client";
import { useDebounceState } from "@/hooks/use-debounce-state";
import { Checkbox, IconButton, Input } from "@mui/material";
import { Clear } from "@mui/icons-material";

interface ShoppingListItemProps {
  shoppingListId: string;
  listItem: ListItem;
  onEnterKey: (sortOrder: number) => void;
  autoFocus: boolean;
}

export const ShoppingListItem: FC<ShoppingListItemProps> = ({
  shoppingListId,
  listItem,
  onEnterKey,
  autoFocus,
}) => {
  const queryClient = useQueryClient();
  const listItemId = listItem.id;

  const renameListItemMutation = useMutation({
    mutationFn: (data: RenameListItemDto) =>
      apiClient.shoppingLists.listItemsControllerRename(
        shoppingListId,
        listItemId,
        data,
      ),
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: () =>
      apiClient.shoppingLists.listItemsControllerToggleComplete(
        shoppingListId,
        listItemId,
      ),
  });

  const deleteListItemMutation = useMutation({
    mutationFn: () =>
      apiClient.shoppingLists.listItemsControllerRemove(
        shoppingListId,
        listItemId,
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["shopping-lists", shoppingListId, "items"],
      }),
  });

  const [name, setName] = useDebounceState(listItem.name, (newName) => {
    renameListItemMutation.mutate({ name: newName });
  });
  const [complete, setComplete] = useState(listItem.complete);

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function handleCompleteChange(e: ChangeEvent<HTMLInputElement>) {
    setComplete(e.target.checked);
    toggleCompleteMutation.mutate();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.code === "Enter") {
      onEnterKey(listItem.sortOrder);
    }

    if (e.code === "Backspace" && name === "") {
      deleteListItemMutation.mutate();
    }
  }

  return (
    <Input
      value={name}
      onChange={handleNameChange}
      onKeyDown={handleKeyDown}
      disabled={complete}
      autoFocus={autoFocus}
      placeholder="List item"
      fullWidth
      sx={{
        marginTop: "1em",
        ...(complete && { textDecoration: "line-through" }),
      }}
      startAdornment={
        <Checkbox checked={complete} onChange={handleCompleteChange} />
      }
      endAdornment={
        <IconButton onClick={() => deleteListItemMutation.mutate()}>
          <Clear />
        </IconButton>
      }
    />
  );
};
