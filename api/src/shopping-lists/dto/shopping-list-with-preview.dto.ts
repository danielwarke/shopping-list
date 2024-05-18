import { ShoppingList } from "../../_gen/prisma-class/shopping_list";
import { ListItem } from "../../_gen/prisma-class/list_item";
import { IntersectionType, OmitType, PickType } from "@nestjs/swagger";
import { User } from "../../_gen/prisma-class/user";
import { ShoppingListRelations } from "../../_gen/prisma-class/shopping_list_relations";

class SharedUser extends PickType(User, ["name", "email"]) {}

export class ShoppingListWithPreview extends IntersectionType(
  OmitType(ShoppingList, ["createdByUserId"]),
  PickType(ShoppingListRelations, ["color"]),
) {
  createdByUser: SharedUser;
  sharedWithUsers: SharedUser[];
  listItemsPreview: ListItem[];
  incompleteItemCount: number;
}
