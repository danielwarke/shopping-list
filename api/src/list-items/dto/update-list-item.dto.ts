import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateListItemDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  complete?: boolean;

  @IsBoolean()
  @IsOptional()
  header?: boolean;
}
