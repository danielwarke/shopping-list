import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class SignUpDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
