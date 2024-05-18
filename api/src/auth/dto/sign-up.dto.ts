import { IsEmail, IsOptional, IsString } from "class-validator";

export class SignUpDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  inviteToken?: string;
}
