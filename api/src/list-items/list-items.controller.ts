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
import { AppendListItemDto } from "./dto/append-list-item.dto";
import { JwtRequest } from "../types";
import { SetListItemCompleteDto } from "./dto/set-list-item-complete.dto";
import { InsertListItemDto } from "./dto/insert-list-item.dto";
import { ReorderShoppingListDto } from "./dto/reorder-shopping-list.dto";

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
  append(
    @Req() req: JwtRequest,
    @Param("shoppingListId") shoppingListId: string,
    @Body() appendListItemDto: AppendListItemDto,
  ) {
    return this.listItemsService.append(
      req.user.userId,
      shoppingListId,
      appendListItemDto,
    );
  }

  @Post("insert")
  insert(
    @Req() req: JwtRequest,
    @Param("shoppingListId") shoppingListId: string,
    @Body() insertListItemDto: InsertListItemDto,
  ) {
    return this.listItemsService.insert(
      req.user.userId,
      shoppingListId,
      insertListItemDto,
    );
  }

  @Patch("reorder")
  reorder(
    @Req() req: JwtRequest,
    @Param("shoppingListId") shoppingListId: string,
    @Body() reorderShoppingListDto: ReorderShoppingListDto,
  ) {
    return this.listItemsService.reorder(
      req.user.userId,
      shoppingListId,
      reorderShoppingListDto,
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

  @Delete("complete")
  removeCompleteItems(
    @Req() req: JwtRequest,
    @Param("shoppingListId") shoppingListId: string,
  ) {
    return this.listItemsService.removeCompleteItems(
      req.user.userId,
      shoppingListId,
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
