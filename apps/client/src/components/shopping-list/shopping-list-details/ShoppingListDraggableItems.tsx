import { FC } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { ShoppingListItem } from "@/components/shopping-list/shopping-list-details/ShoppingListItem";
import { Container as DraggableContainer } from "react-smooth-dnd";
import { ReorderShoppingListDto } from "@/api/client-sdk/Api";

interface ShoppingListDraggableItemsProps {
  shoppingListId: string;
  autoFocusListItemId: string;
  handleCreateListItem: (sortOrder: number) => void;
}

export const ShoppingListDraggableItems: FC<
  ShoppingListDraggableItemsProps
> = ({ shoppingListId, autoFocusListItemId, handleCreateListItem }) => {
  const queryClient = useQueryClient();

  const { data: listItems = [] } = useQuery({
    queryKey: ["shopping-lists", shoppingListId, "items"],
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
        queryKey: ["shopping-lists", shoppingListId, "items"],
      });
    },
  });

  return (
    <DraggableContainer
      dragHandleSelector=".drag-handle"
      lockAxis="y"
      onDrop={({ removedIndex, addedIndex }) => {
        if (removedIndex === null || addedIndex === null) {
          return;
        }

        const reorderedListItems = [...listItems];
        const itemToMove = reorderedListItems[removedIndex];
        reorderedListItems.splice(removedIndex, 1);
        reorderedListItems.splice(addedIndex, 0, itemToMove);

        queryClient.setQueryData(
          ["shopping-lists", shoppingListId, "items"],
          reorderedListItems,
        );

        const updatedOrder = reorderedListItems.map(({ id }, index) => ({
          listItemId: id,
          sortOrder: index + 1,
        }));

        reorderListItemsMutation.mutate({ order: updatedOrder });
      }}
    >
      {listItems.map((listItem) => (
        <ShoppingListItem
          key={listItem.id}
          shoppingListId={shoppingListId}
          listItem={listItem}
          onEnterKey={handleCreateListItem}
          autoFocus={listItem.id === autoFocusListItemId}
        />
      ))}
    </DraggableContainer>
  );
};
