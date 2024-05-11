import { ListItem } from './list_item';
import { User } from './user';
export declare class ShoppingListRelations {
    listItems: ListItem[];
    users: User[];
    createdByUser: User;
}
