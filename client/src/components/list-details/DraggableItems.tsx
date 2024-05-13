import { FC, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { Container as DraggableContainer } from "react-smooth-dnd";
import {
  AppendListItemDto,
  InsertListItemDto,
  ListItem as ListItemDto,
  ReorderShoppingListDto,
} from "@/api/client-sdk/Api";
import { Typography } from "@mui/material";
import { getItemsQueryKey } from "@/api/query-keys";
import { useSetItemData } from "@/hooks/use-set-item-data";
import { ListItem } from "@/components/list-details/ListItem";
import { ListSearchBar } from "@/components/list-details/ListSearchBar";

interface DraggableItemsProps {
  shoppingListId: string;
}

export const DraggableItems: FC<DraggableItemsProps> = ({ shoppingListId }) => {
  const queryClient = useQueryClient();
  const itemsQueryKey = getItemsQueryKey(shoppingListId);
  const { setItemData, setItemAppendedData } = useSetItemData(shoppingListId);

  const [autoFocusListItemId, setAutoFocusListItemId] = useState("");
  const [search, setSearch] = useState("");

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
      apiClient.shoppingLists.shoppingListsControllerReorder(
        shoppingListId,
        data,
      ),
    onError: invalidateCache,
  });

  const appendListItemMutation = useMutation({
    mutationFn: (data: AppendListItemDto) =>
      apiClient.shoppingLists.listItemsControllerAppend(shoppingListId, data),
    onSuccess: (createdListItem) => {
      setAutoFocusListItemId(createdListItem.id);
      setItemAppendedData(createdListItem);
    },
    onError: invalidateCache,
  });

  const insertListItemMutation = useMutation({
    mutationFn: (data: InsertListItemDto) =>
      apiClient.shoppingLists.listItemsControllerInsert(shoppingListId, data),
    onSuccess: (reorderedList) => {
      const newestItem = [...reorderedList].sort((a, b) =>
        a.createdAt > b.createdAt ? -1 : 1,
      )[0];
      setAutoFocusListItemId(newestItem.id);
      setItemData(reorderedList);
    },
    onError: invalidateCache,
  });

  const filteredListItems = useMemo(() => {
    if (search.length === 0) {
      return listItems;
    }

    return listItems.filter((listItem) => {
      return listItem.name.toLowerCase().includes(search.toLowerCase());
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
      appendListItemMutation.mutate({});
    } else {
      insertListItemMutation.mutate({ sortOrder: listItem.sortOrder });
    }
  }

  return (
    <>
      <ListSearchBar
        shoppingListId={shoppingListId}
        search={search}
        setSearch={(value) => {
          setSearch(value);
          setAutoFocusListItemId("");
        }}
      />
      {/* @ts-ignore */}
      <DraggableContainer
        dragHandleSelector=".drag-handle"
        lockAxis="y"
        onDrop={onDropHandler}
      >
        {filteredListItems.map((listItem) => (
          <ListItem
            key={listItem.id}
            shoppingListId={shoppingListId}
            listItem={listItem}
            onEnterKey={() => onEnterKeyHandler(listItem)}
            autoFocus={listItem.id === autoFocusListItemId}
            disableDrag={search.length > 0}
          />
        ))}
      </DraggableContainer>
    </>
  );
};
