import { ShoppingList } from "../../_gen/prisma-class/shopping_list";

export class ShoppingListWithMetadata extends ShoppingList {
  isShared: boolean;
}
