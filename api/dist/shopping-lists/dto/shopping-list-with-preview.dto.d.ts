import { ShoppingList } from "../../_gen/prisma-class/shopping_list";
import { ListItem } from "../../_gen/prisma-class/list_item";
import { User } from "../../_gen/prisma-class/user";
declare const CreatedByUser_base: import("@nestjs/common").Type<Pick<User, "name" | "email">>;
declare class CreatedByUser extends CreatedByUser_base {
}
export declare class ShoppingListWithPreview extends ShoppingList {
    createdByUser: CreatedByUser;
    listItemsPreview: ListItem[];
    incompleteItemCount: number;
}
export {};
