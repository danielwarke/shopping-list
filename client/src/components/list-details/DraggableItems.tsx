import { FC, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { Container as DraggableContainer } from "react-smooth-dnd";
import {
  ListItem as ListItemDto,
  ReorderShoppingListDto,
} from "@/api/client-sdk/Api";
import { Typography } from "@mui/material";
import { getItemsQueryKey } from "@/api/query-keys";
import { useSetItemData } from "@/hooks/use-set-item-data";
import { ListItem } from "@/components/list-details/ListItem";
import { ListSearchBar } from "@/components/list-details/ListSearchBar";
import { useShoppingListContext } from "@/contexts/ShoppingListContext";

interface DraggableItemsProps {
  appendListItem: () => void;
  insertListItem: (data: { sortOrder: number; index: number }) => void;
}

export const DraggableItems: FC<DraggableItemsProps> = ({
  appendListItem,
  insertListItem,
}) => {
  const { id: shoppingListId } = useShoppingListContext();
  const queryClient = useQueryClient();
  const itemsQueryKey = getItemsQueryKey(shoppingListId);
  const { setItemData } = useSetItemData(shoppingListId);

  const [search, setSearch] = useState("");
  const [focusedItemId, setFocusedItemId] = useState("");

  function invalidateCache() {
    queryClient.invalidateQueries({
      queryKey: itemsQueryKey,
    });
  }

  const { data: listItems = [], isLoading } = useQuery({
    queryKey: itemsQueryKey,
    queryFn: () =>
      apiClient.shoppingLists.listItemsControllerFindAll(shoppingListId),
  });

  const reorderListItemsMutation = useMutation({
    mutationFn: (data: ReorderShoppingListDto) =>
      apiClient.shoppingLists.listItemsControllerReorder(shoppingListId, data),
    onError: invalidateCache,
  });

  const filteredListItems = useMemo(() => {
    let searchValue = search.trim().toLowerCase();

    if (searchValue.length === 0) {
      return listItems;
    }

    return listItems.filter((listItem) => {
      return listItem.name.toLowerCase().includes(searchValue);
    });
  }, [listItems, search]);

  if (listItems.length === 0 && !isLoading) {
    return (
      <Typography variant="h5" sx={{ marginTop: "2vh" }}>
        No list items found. Press the button in the bottom right corner to add
        a new item to the list 🧀
      </Typography>
    );
  }

  function onDropHandler({
    removedIndex,
    addedIndex,
  }: {
    removedIndex: number | null;
    addedIndex: number | null;
  }) {
    if (removedIndex === null || addedIndex === null || search.length > 0) {
      return;
    }

    const reorderedListItems = [...listItems];
    const itemToMove = reorderedListItems[removedIndex];
    reorderedListItems.splice(removedIndex, 1);
    reorderedListItems.splice(addedIndex, 0, itemToMove);
    setItemData(reorderedListItems);

    const updatedOrder = reorderedListItems.map(({ id }, index) => ({
      listItemId: id,
      sortOrder: index + 1,
    }));

    reorderListItemsMutation.mutate({ order: updatedOrder });
  }

  function onEnterKeyHandler(listItem: ListItemDto) {
    const listIndex = listItems.findIndex((item) => item.id === listItem.id);
    if (listIndex === listItems.length - 1) {
      appendListItem();
    } else {
      insertListItem({
        sortOrder: listItem.sortOrder,
        index: listIndex,
      });
    }
  }

  return (
    <>
      <ListSearchBar search={search} setSearch={setSearch} />
      {search.length > 0 &&
        listItems.length > 0 &&
        filteredListItems.length === 0 && (
          <Typography variant="subtitle1" sx={{ marginTop: "1vh" }}>
            No list items found
          </Typography>
        )}
      {/* @ts-ignore */}
      <DraggableContainer
        dragHandleSelector=".drag-handle"
        lockAxis="y"
        onDrop={onDropHandler}
      >
        {filteredListItems.map((listItem, index) => (
          <ListItem
            key={listItem.id}
            listItem={listItem}
            isFocused={listItem.id === focusedItemId}
            onFocus={() => setFocusedItemId(listItem.id)}
            onEnterKey={() => onEnterKeyHandler(listItem)}
            previousId={filteredListItems[index - 1]?.id}
            searchApplied={search.length > 0}
          />
        ))}
      </DraggableContainer>
    </>
  );
};
