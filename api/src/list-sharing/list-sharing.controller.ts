import { Body, Controller, Param, Post, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ListSharingService } from "./list-sharing.service";
import { JwtRequest } from "../types";
import { ShareShoppingListDto } from "./dto/share-shopping-list.dto";
import { AcceptListInviteDto } from "./dto/accept-list-invite.dto";

@Controller()
@ApiTags("list-sharing")
@ApiBearerAuth()
export class ListSharingController {
  constructor(private listSharingService: ListSharingService) {}

  @Post(":id/share")
  share(
    @Req() req: JwtRequest,
    @Param("id") id: string,
    @Body() shareShoppingListDto: ShareShoppingListDto,
  ) {
    const { userId, name } = req.user;
    return this.listSharingService.share(
      userId,
      name,
      id,
      shareShoppingListDto,
    );
  }

  @Post("accept-invite")
  acceptInvite(
    @Req() req: JwtRequest,
    @Body() acceptListInviteDto: AcceptListInviteDto,
  ) {
    return this.listSharingService.acceptInvite(
      req.user.userId,
      acceptListInviteDto,
    );
  }
}
