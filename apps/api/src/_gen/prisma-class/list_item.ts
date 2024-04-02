import { ApiProperty } from '@nestjs/swagger'

export class ListItem {
	@ApiProperty({ type: String })
	id: string

	@ApiProperty({ type: String })
	name: string

	@ApiProperty({ type: Boolean })
	complete: boolean

	@ApiProperty({ type: Number })
	sortOrder: number

	@ApiProperty({ type: String })
	shoppingListId: string
}
