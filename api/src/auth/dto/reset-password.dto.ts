import { IsString, IsStrongPassword } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @IsStrongPassword()
  password: string;
}
