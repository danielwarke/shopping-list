import { User } from "./user";
import { ShoppingList } from "./shopping_list";
import { ApiProperty } from "@nestjs/swagger";

export class ListItemRelations {
  @ApiProperty({ type: () => User })
  createdByUser: User;

  @ApiProperty({ type: () => ShoppingList })
  shoppingList: ShoppingList;
}
