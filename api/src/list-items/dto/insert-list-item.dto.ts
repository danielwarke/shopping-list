import { IsNumber, IsOptional, IsString } from "class-validator";

export class InsertListItemDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  sortOrder: number;
}
