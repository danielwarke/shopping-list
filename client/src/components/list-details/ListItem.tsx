import { FC, KeyboardEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ListItem as ListItemInterface,
  UpdateListItemDto,
} from "@/api/client-sdk/Api";
import { apiClient } from "@/api/api-client";
import { useDebounceState } from "@/hooks/use-debounce-state";
import { Checkbox, IconButton, InputAdornment, TextField } from "@mui/material";
import {
  Clear,
  DragIndicator,
  TextDecrease,
  TextIncrease,
} from "@mui/icons-material";
import { Draggable } from "react-smooth-dnd";
import { getItemsQueryKey } from "@/api/query-keys";
import { useSetItemData } from "@/hooks/use-set-item-data";
import { useShoppingListContext } from "@/contexts/ShoppingListContext";
import { useAuthContext } from "@/contexts/AuthContext";

interface ListItemProps {
  listItem: ListItemInterface;
  onEnterKey: () => void;
  previousId?: string;
  searchApplied?: boolean;
}

export const ListItem: FC<ListItemProps> = ({
  listItem,
  onEnterKey,
  searchApplied,
  previousId,
}) => {
  const listItemId = listItem.id;
  const shoppingListId = listItem.shoppingListId;
  const { colorId } = useShoppingListContext();
  const { userId } = useAuthContext();

  const queryClient = useQueryClient();
  const itemsQueryKey = getItemsQueryKey(shoppingListId);
  const { setItemDeleteData, setItemUpdateData } =
    useSetItemData(shoppingListId);

  const [isFocused, setIsFocused] = useState(false);

  function invalidateCache() {
    return queryClient.invalidateQueries({
      queryKey: itemsQueryKey,
    });
  }

  const updateListItemMutation = useMutation({
    mutationFn: (data: UpdateListItemDto) =>
      apiClient.shoppingLists.listItemsControllerUpdate(
        shoppingListId,
        listItemId,
        data,
      ),
    onMutate: (data) => {
      if (typeof data.name === "undefined") {
        setItemUpdateData(listItemId, data);
      }
    },
    onError: invalidateCache,
  });

  const deleteListItemMutation = useMutation({
    mutationFn: (_: { fromKeyboard: boolean }) =>
      apiClient.shoppingLists.listItemsControllerRemove(
        shoppingListId,
        listItemId,
      ),
    onMutate: (data) => {
      if (data.fromKeyboard && previousId && !searchApplied) {
        document.getElementById(previousId)?.focus();
      }

      setItemDeleteData([listItemId]);
    },
    onError: invalidateCache,
  });

  const [name, setName] = useDebounceState(listItem.name, (newName) => {
    updateListItemMutation.mutate({ name: newName });
  });

  async function handleKeyDown(e: KeyboardEvent) {
    if (e.code === "Enter") {
      onEnterKey();
    }

    if (e.code === "Backspace" && name === "") {
      e.preventDefault();
      deleteListItemMutation.mutate({ fromKeyboard: true });
    }
  }

  return (
    // @ts-ignore
    <Draggable key={listItemId}>
      <TextField
        id={listItemId}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setTimeout(() => setIsFocused(false), 100);
        }}
        autoFocus={listItem.createdByUserId === userId}
        placeholder="List item"
        fullWidth
        margin="dense"
        variant="standard"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {!searchApplied && (
                <DragIndicator
                  className="drag-handle"
                  sx={{
                    cursor: "grab",
                    padding: "6px",
                  }}
                  onClick={(e) => e.preventDefault()}
                />
              )}
              {!listItem.header && (
                <Checkbox
                  checked={listItem.complete}
                  onChange={(e) =>
                    updateListItemMutation.mutate({
                      complete: e.target.checked,
                    })
                  }
                  color={colorId ? "default" : "primary"}
                />
              )}
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {isFocused && (
                <IconButton
                  size="small"
                  onClick={() => {
                    updateListItemMutation.mutate({ header: !listItem.header });
                  }}
                >
                  {listItem.header ? <TextDecrease /> : <TextIncrease />}
                </IconButton>
              )}
              <IconButton
                onClick={() =>
                  deleteListItemMutation.mutate({ fromKeyboard: false })
                }
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            ...(listItem.header && {
              fontSize: "1.75em",
              paddingX: 0,
              backgroundColor: "rgba(0, 0, 0, 0.15)",
              borderRadius: "4px",
            }),
            ...(listItem.complete && {
              textDecoration: "line-through",
              color: "gray",
            }),
          },
          disableUnderline: !!colorId,
        }}
      />
    </Draggable>
  );
};
