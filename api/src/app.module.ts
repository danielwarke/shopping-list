import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { APP_GUARD, RouterModule } from "@nestjs/core";
import { JwtAuthGuard } from "./common/guards";
import { ShoppingListsModule } from "./shopping-lists/shopping-lists.module";
import { ListItemsModule } from "./list-items/list-items.module";
import { ListSharingModule } from "./list-sharing/list-sharing.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    AuthModule,
    UsersModule,
    ShoppingListsModule,
    ListItemsModule,
    ListSharingModule,
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
      {
        path: "list-sharing",
        module: ListSharingModule,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
