import { ChangeEvent, FC, KeyboardEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ListItem, RenameListItemDto } from "@/api/client-sdk/Api";
import { apiClient } from "@/api/api-client";
import { useDebounceState } from "@/hooks/use-debounce-state";
import { IconButton, Input, TextField } from "@mui/material";
import { Clear } from "@mui/icons-material";

interface ShoppingListItemProps {
  shoppingListId: string;
  listItem: ListItem;
  onEnterKey: () => void;
}

export const ShoppingListItem: FC<ShoppingListItemProps> = ({
  shoppingListId,
  listItem,
  onEnterKey,
}) => {
  const queryClient = useQueryClient();

  const renameListItemMutation = useMutation({
    mutationFn: (data: RenameListItemDto) =>
      apiClient.shoppingLists.listItemsControllerRename(
        shoppingListId,
        listItem.id,
        data,
      ),
  });

  const deleteListItemMutation = useMutation({
    mutationFn: () =>
      apiClient.shoppingLists.listItemsControllerRemove(
        shoppingListId,
        listItem.id,
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["shopping-lists", shoppingListId, "items"],
      }),
  });

  const [name, setName] = useDebounceState(listItem.name, (newName) => {
    renameListItemMutation.mutate({ name: newName });
  });

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.code === "Enter") {
      onEnterKey();
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
      placeholder="List item"
      fullWidth
      sx={{ marginTop: "1em" }}
      endAdornment={
        <IconButton onClick={() => deleteListItemMutation.mutate()}>
          <Clear />
        </IconButton>
      }
    />
  );
};
