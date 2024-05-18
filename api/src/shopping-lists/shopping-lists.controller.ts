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
import { ShoppingListsService } from "./shopping-lists.service";
import { CreateShoppingListDto } from "./dto/create-shopping-list.dto";
import { UpdateShoppingListDto } from "./dto/update-shopping-list.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtRequest } from "../types";

@Controller()
@ApiTags("shopping-lists")
@ApiBearerAuth()
export class ShoppingListsController {
  constructor(private readonly shoppingListsService: ShoppingListsService) {}

  @Post()
  create(
    @Req() req: JwtRequest,
    @Body() createShoppingListDto: CreateShoppingListDto,
  ) {
    return this.shoppingListsService.create(
      req.user.userId,
      createShoppingListDto,
    );
  }

  @Get()
  findAll(@Req() req: JwtRequest) {
    return this.shoppingListsService.findAll(req.user.userId);
  }

  @Get(":id")
  findOne(@Req() req: JwtRequest, @Param("id") id: string) {
    return this.shoppingListsService.findOne(req.user.userId, id);
  }

  @Patch(":id/rename")
  rename(
    @Req() req: JwtRequest,
    @Param("id") id: string,
    @Body() updateShoppingListDto: UpdateShoppingListDto,
  ) {
    return this.shoppingListsService.rename(
      req.user.userId,
      id,
      updateShoppingListDto,
    );
  }

  @Delete(":id")
  remove(@Req() req: JwtRequest, @Param("id") id: string) {
    return this.shoppingListsService.remove(req.user.userId, id);
  }
}
