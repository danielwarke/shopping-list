import { ApiProperty } from '@nestjs/swagger'

export class ShoppingList {
	@ApiProperty({ type: String })
	id: string

	@ApiProperty({ type: String })
	name: string
}
