import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class User {
	@ApiProperty({ type: String })
	id: string

	@ApiProperty({ type: String })
	name: string

	@ApiProperty({ type: String })
	email: string

	@ApiPropertyOptional({ type: Date })
	emailVerified?: Date

	@ApiProperty({ type: String })
	password: string

	@ApiPropertyOptional({ type: String })
	token?: string

	@ApiProperty({ type: Date })
	createdAt: Date
}
