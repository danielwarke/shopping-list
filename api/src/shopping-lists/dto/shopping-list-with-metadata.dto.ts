import { IntersectionType, PickType } from "@nestjs/swagger";
import { ShoppingList } from "../../_gen/prisma-class/shopping_list";
import { ShoppingListRelations } from "../../_gen/prisma-class/shopping_list_relations";

export class ShoppingListWithMetadata extends IntersectionType(
  ShoppingList,
  PickType(ShoppingListRelations, ["color"]),
) {
  isShared: boolean;
}
