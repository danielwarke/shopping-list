import { FC, KeyboardEvent, useRef, useState } from "react";
import { ListItem as ListItemInterface } from "@/api/client-sdk/Api";
import { useDebounceState } from "@/hooks/use-debounce-state";
import { Checkbox, IconButton, InputAdornment, TextField } from "@mui/material";
import {
  Clear,
  DragIndicator,
  TextDecrease,
  TextIncrease,
} from "@mui/icons-material";
import { Draggable } from "react-smooth-dnd";
import { useShoppingListContext } from "@/contexts/ShoppingListContext";
import {
  useDeleteListItemMutation,
  useUpdateListItemMutation,
} from "@/api/mutation-hooks/list-item";

interface ListItemProps {
  listItem: ListItemInterface;
  onEnterKey: () => void;
  onBulkCreate: (itemsToCreate: string[]) => void;
  previousId?: string;
  nextId?: string;
  searchApplied?: boolean;
}

export const ListItem: FC<ListItemProps> = ({
  listItem,
  onEnterKey,
  onBulkCreate,
  previousId,
  nextId,
  searchApplied,
}) => {
  const listItemId = listItem.id;
  const { colorId } = useShoppingListContext();

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const updateListItemMutation = useUpdateListItemMutation();
  const deleteListItemMutation = useDeleteListItemMutation((fromKeyboard) => {
    if (fromKeyboard && previousId && !searchApplied) {
      document.getElementById(previousId)?.focus();
    }
  });

  const [name, setName] = useDebounceState(listItem.name, (newName) => {
    updateListItemMutation.mutate({ id: listItemId, name: newName });
  });

  const [isFocused, setIsFocused] = useState(false);

  function focusItem(itemId: string) {
    document.getElementById(itemId)?.focus();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.code === "Enter" && !searchApplied) {
      e.preventDefault();
      e.stopPropagation();
      onEnterKey();
    }

    if (e.code === "Backspace" && name === "") {
      e.preventDefault();
      deleteListItemMutation.mutate({ id: listItemId, fromKeyboard: true });
    }

    if (!inputRef.current) {
      return;
    }

    const { selectionStart, selectionEnd } = inputRef.current;

    if (
      e.code === "ArrowUp" &&
      previousId &&
      selectionStart === 0 &&
      selectionEnd === 0
    ) {
      focusItem(previousId);
    }

    if (
      e.code === "ArrowDown" &&
      nextId &&
      selectionStart === name.length &&
      selectionEnd === name.length
    ) {
      focusItem(nextId);
    }
  }

  async function handlePaste(e: React.ClipboardEvent) {
    const clipboardData = e.clipboardData;
    const textData = clipboardData.getData("Text");
    const listItems = textData
      .split("\n")
      .filter((item) => !!item)
      .map((item) => item.replace("▢", ""));

    // allow default behavior for single item
    if (listItems.length < 2) {
      return;
    }
    e.stopPropagation();
    e.preventDefault();

    const firstItem = listItems.shift();
    if (firstItem) {
      await updateListItemMutation.mutateAsync({
        id: listItemId,
        name: name + firstItem,
      });
    }

    onBulkCreate(listItems);
  }

  return (
    // @ts-ignore
    <Draggable key={listItemId}>
      <TextField
        id={listItemId}
        inputRef={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="List item"
        fullWidth
        multiline
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
                      id: listItemId,
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
                  onMouseDown={() => {
                    updateListItemMutation.mutate({
                      id: listItemId,
                      header: !listItem.header,
                    });
                  }}
                >
                  {listItem.header ? <TextDecrease /> : <TextIncrease />}
                </IconButton>
              )}
              <IconButton
                onClick={() =>
                  deleteListItemMutation.mutate({
                    id: listItemId,
                    fromKeyboard: false,
                  })
                }
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            ...(listItem.header && {
              fontSize: "1.25em",
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
