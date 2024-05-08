import { IsEmail, IsString } from "class-validator";

export class ShareShoppingListDto {
  @IsEmail()
  @IsString()
  otherUserEmail: string;
}
