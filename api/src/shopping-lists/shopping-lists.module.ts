import { Module } from "@nestjs/common";
import { ShoppingListsService } from "./shopping-lists.service";
import { ShoppingListsController } from "./shopping-lists.controller";
import { EmailsModule } from "../emails/emails.module";
import { GatewayModule } from "../gateway/gateway.module";

@Module({
  imports: [EmailsModule, GatewayModule],
  controllers: [ShoppingListsController],
  providers: [ShoppingListsService],
})
export class ShoppingListsModule {}
