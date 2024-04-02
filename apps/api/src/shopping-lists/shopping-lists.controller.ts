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

@Controller("shopping-lists")
@ApiTags("shopping-lists")
@ApiBearerAuth()
export class ShoppingListsController {
  constructor(private readonly shoppingListsService: ShoppingListsService) {}

  @Post()
  create(@Req() req, @Body() createShoppingListDto: CreateShoppingListDto) {
    return this.shoppingListsService.create(
      req.user.email,
      createShoppingListDto,
    );
  }

  @Get()
  findAll(@Req() req) {
    return this.shoppingListsService.findAll(req.user.email);
  }

  @Get(":id")
  findOne(@Req() req, @Param("id") id: string) {
    return this.shoppingListsService.findOne(req.user.email, id);
  }

  @Patch(":id")
  update(
    @Req() req,
    @Param("id") id: string,
    @Body() updateShoppingListDto: UpdateShoppingListDto,
  ) {
    return this.shoppingListsService.update(
      req.user.email,
      id,
      updateShoppingListDto,
    );
  }

  @Delete(":id")
  remove(@Req() req, @Param("id") id: string) {
    return this.shoppingListsService.remove(req.user.email, id);
  }
}
