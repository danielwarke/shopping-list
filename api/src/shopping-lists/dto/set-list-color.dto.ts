import { IsOptional, IsString } from "class-validator";

export class SetListColorDto {
  @IsString()
  @IsOptional()
  colorId?: string;
}
