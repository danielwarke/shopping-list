import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ListItemsService } from "./list-items.service";
import { RenameListItemDto } from "./dto/rename-list-item.dto";
import { CreateListItemDto } from "./dto/create-list-item.dto";
import { JwtRequest } from "../types";
import { SetListItemCompleteDto } from "./dto/set-list-item-complete.dto";

@Controller()
@ApiTags("items")
@ApiBearerAuth()
export class ListItemsController {
  constructor(private readonly listItemsService: ListItemsService) {}

  @Get()
  findAll(
    @Req() req: JwtRequest,
    @Param("shoppingListId") shoppingListId: string,
  ) {
    return this.listItemsService.findAll(req.user.userId, shoppingListId);
  }

  @Post()
  create(
    @Req() req: JwtRequest,
    @Param("shoppingListId") shoppingListId: string,
    @Body() createListItemDto: CreateListItemDto,
  ) {
    return this.listItemsService.create(
      req.user.userId,
      shoppingListId,
      createListItemDto,
    );
  }

  @Patch(":id/rename")
  rename(
    @Req() req: JwtRequest,
    @Param("shoppingListId") shoppingListId: string,
    @Param("id") id: string,
    @Body() renameListItemDto: RenameListItemDto,
  ) {
    return this.listItemsService.rename(
      req.user.userId,
      shoppingListId,
      id,
      renameListItemDto,
    );
  }

  @Patch(":id/set-complete")
  setComplete(
    @Req() req: JwtRequest,
    @Param("shoppingListId") shoppingListId: string,
    @Param("id") id: string,
    @Body() setListItemCompleteDto: SetListItemCompleteDto,
  ) {
    return this.listItemsService.setComplete(
      req.user.userId,
      shoppingListId,
      id,
      setListItemCompleteDto,
    );
  }

  @Delete(":id")
  remove(
    @Req() req: JwtRequest,
    @Param("shoppingListId") shoppingListId: string,
    @Param("id") id: string,
  ) {
    return this.listItemsService.remove(req.user.userId, shoppingListId, id);
  }
}
