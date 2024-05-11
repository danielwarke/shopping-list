import { Module } from "@nestjs/common";
import { EmailsModule } from "../emails/emails.module";
import { ListSharingController } from "./list-sharing.controller";
import { ListSharingService } from "./list-sharing.service";

@Module({
  imports: [EmailsModule],
  controllers: [ListSharingController],
  providers: [ListSharingService],
})
export class ListSharingModule {}
