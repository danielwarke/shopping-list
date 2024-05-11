import { IsEmail, IsString } from "class-validator";

export class RevokeAccessDto {
  @IsEmail()
  @IsString()
  email: string;
}
