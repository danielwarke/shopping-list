import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { DatabaseModule } from "../database/database.module";
import { UsersModule } from "../users/users.module";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
