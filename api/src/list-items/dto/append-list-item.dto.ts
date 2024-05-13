import { IsOptional, IsString } from "class-validator";

export class AppendListItemDto {
  @IsString()
  @IsOptional()
  name?: string;
}
