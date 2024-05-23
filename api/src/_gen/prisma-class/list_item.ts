import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ListItem {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Boolean })
  complete: boolean;

  @ApiProperty({ type: Boolean })
  header: boolean;

  @ApiProperty({ type: Number })
  sortOrder: number;

  @ApiProperty({ type: String })
  createdByUserId: string;

  @ApiProperty({ type: String })
  shoppingListId: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;
}
