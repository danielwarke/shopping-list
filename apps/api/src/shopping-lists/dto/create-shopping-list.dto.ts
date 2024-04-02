import { IsOptional, IsString } from "class-validator";

export class CreateShoppingListDto {
  @IsString()
  @IsOptional()
  name?: string;
}
