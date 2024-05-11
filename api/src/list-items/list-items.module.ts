import { Module } from "@nestjs/common";
import { ListItemsService } from "./list-items.service";
import { ListItemsController } from "./list-items.controller";
import { GatewayModule } from "../gateway/gateway.module";

@Module({
  imports: [GatewayModule],
  controllers: [ListItemsController],
  providers: [ListItemsService],
})
export class ListItemsModule {}
