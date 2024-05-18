import { ListItem } from './list_item'
import { User } from './user'
import { ListColor } from './list_color'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ShoppingListRelations {
	@ApiProperty({ isArray: true, type: () => ListItem })
	listItems: ListItem[]

	@ApiProperty({ isArray: true, type: () => User })
	users: User[]

	@ApiProperty({ type: () => User })
	createdByUser: User

	@ApiPropertyOptional({ type: () => ListColor })
	color?: ListColor
}
