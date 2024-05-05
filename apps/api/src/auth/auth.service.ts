import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { SignUpDto } from "./dto/sign-up.dto";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Injectable()
export class AuthService {
  private readonly saltOrRounds = 10;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    const { name, email } = signUpDto;
    const existingUser = await this.usersService.fineOneByEmail(email);
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
    const user = await this.usersService.fineOneByEmail(email);
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

  async forgotPassword(email: string) {
    const user = await this.usersService.fineOneByEmail(email);
    if (user) {
      try {
        const payload = { sub: user.id };
        const resetToken = this.jwtService.sign(payload, { expiresIn: "10m" });
        await this.usersService.setToken(email, resetToken);
        const clientDomain = this.configService.get<string>("CLIENT_DOMAIN");
        const url = `${clientDomain}/reset-password?token=${resetToken}`;

        this.mailerService.sendMail({
          to: email,
          subject: "Shopping List - Forgot Password",
          template: "../templates/forgot-password",
          context: {
            url,
          },
        });
      } catch (e) {
        // we don't want the user to know if this was successful or not to avoid leaking data
        console.error(e);
      }
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    let userId: string;

    try {
      const { sub } = await this.jwtService.verifyAsync<{ sub: string }>(
        resetPasswordDto.token,
      );
      userId = sub;
    } catch (e) {
      throw new InternalServerErrorException(e.message.replace("jwt", "token"));
    }

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.token !== resetPasswordDto.token) {
      throw new UnprocessableEntityException("Token is invalid");
    }

    const hashedPass = await bcrypt.hash(
      resetPasswordDto.password,
      this.saltOrRounds,
    );

    const updatedUser = await this.usersService.resetPassword(
      user.email,
      hashedPass,
    );

    const { password, ...rest } = updatedUser;
    return rest;
  }
}
