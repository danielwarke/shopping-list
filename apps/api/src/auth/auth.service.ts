import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
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
import { VerifyEmailDto } from "./dto/verify-email.dto";

@Injectable()
export class AuthService {
  private readonly saltOrRounds = 10;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  private sendVerifyEmail(email: string, name: string, token: string) {
    const clientDomain = this.configService.get<string>("CLIENT_DOMAIN");
    const url = `${clientDomain}/verify-email?token=${token}`;

    return this.mailerService.sendMail({
      to: email,
      subject: "Shopping List - Verify Email Address",
      template: "../templates/verify-email",
      context: {
        url,
        name,
      },
    });
  }

  private async validateUserToken(
    token: string,
    tokenType: "password" | "email",
  ) {
    let userId: string;
    let userTokenType: string;

    try {
      const { sub, type } = await this.jwtService.verifyAsync<{
        sub: string;
        type: string;
      }>(token);
      userId = sub;
      userTokenType = type;
    } catch (e) {
      throw new InternalServerErrorException(e.message.replace("jwt", "token"));
    }

    if (userTokenType !== tokenType) {
      throw new ConflictException("Invalid token type");
    }

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.token !== token) {
      throw new UnprocessableEntityException("Token is invalid");
    }

    return user;
  }

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

    const tokenPayload = { sub: user.id, type: "email" };
    const verifyEmailToken = this.jwtService.sign(tokenPayload, {
      expiresIn: "1 year",
    });
    await this.usersService.setToken(email, verifyEmailToken);
    this.sendVerifyEmail(email, name, verifyEmailToken);

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
    if (!user.emailVerified) {
      this.sendVerifyEmail(user.email, user.name, user.token);
      throw new UnauthorizedException(
        "Please verify your email address before logging in. A new verification email has been sent.",
      );
    }

    const payload = { sub: user.id, email: user.email, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.validateUserToken(verifyEmailDto.token, "email");
    return this.usersService.verifyEmail(user.email);
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.fineOneByEmail(email);
    // user must verify email address before resetting password
    if (!user || !user.emailVerified) {
      return;
    }

    try {
      const payload = { sub: user.id, type: "password" };
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
          name: user.name,
        },
      });
    } catch (e) {
      // we don't want the user to know if this was successful or not to avoid leaking data
      console.error(e);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.validateUserToken(
      resetPasswordDto.token,
      "password",
    );

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
