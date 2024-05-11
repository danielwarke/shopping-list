import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ShoppingList {
	@ApiProperty({ type: String })
	id: string

	@ApiProperty({ type: String })
	name: string

	@ApiProperty({ type: String })
	createdByUserId: string

	@ApiProperty({ type: Date })
	createdAt: Date

	@ApiPropertyOptional({ type: Date })
	updatedAt?: Date
}
