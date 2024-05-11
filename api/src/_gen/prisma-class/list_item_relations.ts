import { ShoppingList } from './shopping_list'
import { ApiProperty } from '@nestjs/swagger'

export class ListItemRelations {
	@ApiProperty({ type: () => ShoppingList })
	shoppingList: ShoppingList
}
