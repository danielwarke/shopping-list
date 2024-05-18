import { ApiProperty } from '@nestjs/swagger'

export class ListColor {
	@ApiProperty({ type: String })
	id: string

	@ApiProperty({ type: String })
	name: string

	@ApiProperty({ type: String })
	hex: string
}
