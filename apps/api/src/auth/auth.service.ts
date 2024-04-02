import { ConflictException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { SignUpDto } from "./dto/sign-up.dto";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
  private readonly saltOrRounds = 10;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    const { name, email } = signUpDto;
    const existingUser = await this.usersService.fineOne(email);
    if (existingUser) {
      throw new ConflictException(
        `User with email address ${email} already exists`,
      );
    }

    const hashedPass = await bcrypt.hash(signUpDto.password, this.saltOrRounds);
    const user = await this.usersService.create({
      name,
      email,
      password: hashedPass,
    });

    const { password, ...rest } = user;
    return rest;
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.fineOne(email);
    if (user) {
      const { password: userPass, ...result } = user;
      const isMatch = await bcrypt.compare(pass, userPass);
      if (isMatch) {
        return result;
      }
    }

    return null;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
