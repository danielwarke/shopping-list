import { Module } from "@nestjs/common";
import { ListItemsService } from "./list-items.service";
import { ListItemsController } from "./list-items.controller";

@Module({
  controllers: [ListItemsController],
  providers: [ListItemsService],
})
export class ListItemsModule {}
