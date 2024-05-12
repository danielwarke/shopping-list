export const shoppingListsQueryKey = ["shopping-lists"];

export const getShoppingListQueryKey = (shoppingListId: string) => [
  ...shoppingListsQueryKey,
  shoppingListId,
];

export const getItemsQueryKey = (shoppingListId: string) => [
  ...getShoppingListQueryKey(shoppingListId),
  "items",
];
