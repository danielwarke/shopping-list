import { ShoppingList } from "../../_gen/prisma-class/shopping_list";
import { ListItem } from "../../_gen/prisma-class/list_item";
import { PickType } from "@nestjs/swagger";
import { User } from "../../_gen/prisma-class/user";

class CreatedByUser extends PickType(User, ["name", "email"]) {}

export class ShoppingListWithPreview extends ShoppingList {
  createdByUser: CreatedByUser;
  listItemsPreview: ListItem[];
  incompleteItemCount: number;
}
