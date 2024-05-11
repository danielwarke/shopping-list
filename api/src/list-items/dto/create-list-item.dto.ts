import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateListItemDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}
