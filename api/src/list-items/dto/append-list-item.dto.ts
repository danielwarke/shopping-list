import { IsOptional, IsString } from "class-validator";

export class AppendListItemDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
