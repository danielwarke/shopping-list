import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { APP_GUARD, RouterModule } from "@nestjs/core";
import { JwtAuthGuard } from "./common/guards";
import { ShoppingListsModule } from "./shopping-lists/shopping-lists.module";
import { ListItemsModule } from "./list-items/list-items.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: configService.get<string>("EMAIL_TRANSPORT"),
        defaults: {
          from: `"Shopping List" <${configService.get<string>("EMAIL_FROM")}>`,
        },
        template: {
          dir: __dirname + "/templates",
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ShoppingListsModule,
    ListItemsModule,
    RouterModule.register([
      {
        path: "auth",
        module: AuthModule,
      },
      {
        path: "shopping-lists",
        module: ShoppingListsModule,
        children: [
          {
            path: ":shoppingListId/items",
            module: ListItemsModule,
          },
        ],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
