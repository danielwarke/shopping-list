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
import { AppendListItemDto } from "./dto/append-list-item.dto";
import { JwtRequest } from "../types";
import { InsertListItemDto } from "./dto/insert-list-item.dto";
import { ReorderShoppingListDto } from "./dto/reorder-shopping-list.dto";
import { UpdateListItemDto } from "./dto/update-list-item.dto";

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

  @Patch(":id")
  rename(
    @Req() req: JwtRequest,
    @Param("shoppingListId") shoppingListId: string,
    @Param("id") id: string,
    @Body() updateListItemDto: UpdateListItemDto,
  ) {
    return this.listItemsService.update(
      req.user.userId,
      shoppingListId,
      id,
      updateListItemDto,
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
