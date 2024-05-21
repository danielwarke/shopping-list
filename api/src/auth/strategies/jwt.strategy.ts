import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  async validate(payload: { sub: string; email: string; name: string }) {
    const user = await this.usersService.fineOneByEmail(payload.email);
    if (!user) {
      throw new NotFoundException("User does not exist");
    }

    return {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
      emailVerified: !!user.emailVerified,
    };
  }
}
