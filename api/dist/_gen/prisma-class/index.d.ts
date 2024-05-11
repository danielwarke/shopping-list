import { UserRelations as _UserRelations } from './user_relations';
import { ShoppingListRelations as _ShoppingListRelations } from './shopping_list_relations';
import { ListItemRelations as _ListItemRelations } from './list_item_relations';
import { User as _User } from './user';
import { ShoppingList as _ShoppingList } from './shopping_list';
import { ListItem as _ListItem } from './list_item';
export declare namespace PrismaModel {
    class UserRelations extends _UserRelations {
    }
    class ShoppingListRelations extends _ShoppingListRelations {
    }
    class ListItemRelations extends _ListItemRelations {
    }
    class User extends _User {
    }
    class ShoppingList extends _ShoppingList {
    }
    class ListItem extends _ListItem {
    }
    const extraModels: (typeof UserRelations | typeof ShoppingListRelations | typeof ListItemRelations | typeof User | typeof ShoppingList | typeof ListItem)[];
}
