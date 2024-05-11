import { ShoppingList } from "../../_gen/prisma-class/shopping_list";
import { ListItem } from "../../_gen/prisma-class/list_item";
import { OmitType, PickType } from "@nestjs/swagger";
import { User } from "../../_gen/prisma-class/user";

class SharedUser extends PickType(User, ["name", "email"]) {}

export class ShoppingListWithPreview extends OmitType(ShoppingList, [
  "createdByUserId",
]) {
  createdByUser: SharedUser;
  sharedWithUsers: SharedUser[];
  listItemsPreview: ListItem[];
  incompleteItemCount: number;
}
