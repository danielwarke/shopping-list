import { ShoppingList } from './shopping_list'
import { ApiProperty } from '@nestjs/swagger'

export class ListColorRelations {
	@ApiProperty({ isArray: true, type: () => ShoppingList })
	shoppingLists: ShoppingList[]
}
