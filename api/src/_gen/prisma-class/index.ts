import { UserRelations as _UserRelations } from './user_relations'
import { ShoppingListRelations as _ShoppingListRelations } from './shopping_list_relations'
import { ListItemRelations as _ListItemRelations } from './list_item_relations'
import { ListColorRelations as _ListColorRelations } from './list_color_relations'
import { User as _User } from './user'
import { ShoppingList as _ShoppingList } from './shopping_list'
import { ListItem as _ListItem } from './list_item'
import { ListColor as _ListColor } from './list_color'

export namespace PrismaModel {
	export class UserRelations extends _UserRelations {}
	export class ShoppingListRelations extends _ShoppingListRelations {}
	export class ListItemRelations extends _ListItemRelations {}
	export class ListColorRelations extends _ListColorRelations {}
	export class User extends _User {}
	export class ShoppingList extends _ShoppingList {}
	export class ListItem extends _ListItem {}
	export class ListColor extends _ListColor {}

	export const extraModels = [
		UserRelations,
		ShoppingListRelations,
		ListItemRelations,
		ListColorRelations,
		User,
		ShoppingList,
		ListItem,
		ListColor,
	]
}
