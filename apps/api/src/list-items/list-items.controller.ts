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
import { CreateShoppingListDto } from "../shopping-lists/dto/create-shopping-list.dto";

@Controller()
@ApiTags("items")
@ApiBearerAuth()
export class ListItemsController {
  constructor(private readonly listItemsService: ListItemsService) {}

  @Get()
  findAll(@Req() req, @Param("shoppingListId") shoppingListId: string) {
    return this.listItemsService.findAll(req.user.email, shoppingListId);
  }

  @Post()
  create(
    @Req() req,
    @Param("shoppingListId") shoppingListId: string,
    @Body() createShoppingListDto: CreateShoppingListDto,
  ) {
    return this.listItemsService.create(
      req.user.email,
      shoppingListId,
      createShoppingListDto,
    );
  }

  @Patch(":id/rename")
  rename(
    @Req() req,
    @Param("shoppingListId") shoppingListId: string,
    @Param("id") id: string,
    @Body() renameListItemDto: RenameListItemDto,
  ) {
    return this.listItemsService.rename(
      req.user.email,
      shoppingListId,
      id,
      renameListItemDto,
    );
  }

  @Patch(":id/toggle-complete")
  toggleComplete(
    @Req() req,
    @Param("shoppingListId") shoppingListId: string,
    @Param("id") id: string,
  ) {
    return this.listItemsService.toggleComplete(
      req.user.email,
      shoppingListId,
      id,
    );
  }

  @Delete(":id")
  remove(
    @Req() req,
    @Param("shoppingListId") shoppingListId: string,
    @Param("id") id: string,
  ) {
    return this.listItemsService.remove(req.user.email, shoppingListId, id);
  }
}
