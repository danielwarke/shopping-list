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
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { EmailsService } from "../emails/emails.service";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class AuthService {
  private readonly saltOrRounds = 10;

  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailsService: EmailsService,
  ) {}

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
    const { name, email, inviteToken } = signUpDto;
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

    if (inviteToken) {
      await this.acceptAppInvite(email, inviteToken);
    }

    const tokenPayload = { sub: user.id, type: "email" };
    const verifyEmailToken = this.jwtService.sign(tokenPayload, {
      expiresIn: "1 year",
    });
    await this.usersService.setToken(email, verifyEmailToken);
    this.emailsService.verifyEmail(email, name, verifyEmailToken);

    const { password, ...rest } = user;
    return rest;
  }

  private async acceptAppInvite(email: string, inviteToken: string) {
    try {
      const { sub, shoppingListId } = await this.jwtService.verifyAsync<{
        sub: string;
        shoppingListId: string;
      }>(inviteToken);

      if (sub === email) {
        return this.prisma.shoppingList.update({
          data: {
            users: {
              connect: {
                email,
              },
            },
          },
          where: {
            id: shoppingListId,
          },
        });
      }
    } catch (e) {
      console.error(e);
    }
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
      this.emailsService.verifyEmail(user.email, user.name, user.token);
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
      this.emailsService.forgotPassword(email, user.name, resetToken);
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
