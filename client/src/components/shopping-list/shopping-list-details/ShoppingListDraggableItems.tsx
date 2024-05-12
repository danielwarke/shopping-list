import { FC, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { ShoppingListItem } from "@/components/shopping-list/shopping-list-details/ShoppingListItem";
import { Container as DraggableContainer } from "react-smooth-dnd";
import { ReorderShoppingListDto } from "@/api/client-sdk/Api";
import { Typography } from "@mui/material";
import { getItemsQueryKey } from "@/api/query-keys";
import { useSetItemData } from "@/hooks/use-set-item-data";

interface ShoppingListDraggableItemsProps {
  shoppingListId: string;
  autoFocusListItemId: string;
  handleCreateListItem: (sortOrder: number) => void;
  search: string;
}

export const ShoppingListDraggableItems: FC<
  ShoppingListDraggableItemsProps
> = ({ shoppingListId, autoFocusListItemId, handleCreateListItem, search }) => {
  const queryClient = useQueryClient();
  const itemsQueryKey = getItemsQueryKey(shoppingListId);
  const { setItemData } = useSetItemData(shoppingListId);

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
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: itemsQueryKey,
      });
    },
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

  return (
    // @ts-ignore
    <DraggableContainer
      dragHandleSelector=".drag-handle"
      lockAxis="y"
      onDrop={onDropHandler}
    >
      {filteredListItems.map((listItem) => (
        <ShoppingListItem
          key={listItem.id}
          shoppingListId={shoppingListId}
          listItem={listItem}
          onEnterKey={handleCreateListItem}
          autoFocus={listItem.id === autoFocusListItemId}
          disableDrag={search.length > 0}
        />
      ))}
    </DraggableContainer>
  );
};
