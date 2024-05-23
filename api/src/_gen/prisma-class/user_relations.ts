import { ShoppingList } from "./shopping_list";
import { ListItem } from "./list_item";
import { ApiProperty } from "@nestjs/swagger";

export class UserRelations {
  @ApiProperty({ isArray: true, type: () => ShoppingList })
  shoppingLists: ShoppingList[];

  @ApiProperty({ isArray: true, type: () => ListItem })
  listItems: ListItem[];

  @ApiProperty({ isArray: true, type: () => ShoppingList })
  createdShoppingLists: ShoppingList[];
}
