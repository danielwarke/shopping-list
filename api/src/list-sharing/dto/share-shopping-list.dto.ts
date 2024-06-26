import { IsEmail, IsString } from "class-validator";

export class ShareShoppingListDto {
  @IsEmail()
  @IsString()
  email: string;
}
