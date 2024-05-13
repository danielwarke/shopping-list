import { IsNumber, IsOptional, IsString } from "class-validator";

export class InsertListItemDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  sortOrder: number;
}
