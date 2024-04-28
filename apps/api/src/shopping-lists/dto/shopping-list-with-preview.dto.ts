import { ShoppingList } from "../../_gen/prisma-class/shopping_list";
import { ListItem } from "../../_gen/prisma-class/list_item";

export class ShoppingListWithPreview extends ShoppingList {
  listItemsPreview: ListItem[];
  itemCount: number;
}
