import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateShoppingListDto } from "./dto/create-shopping-list.dto";
import { UpdateShoppingListDto } from "./dto/update-shopping-list.dto";
import { PrismaService } from "../database/prisma.service";
import { ShoppingList } from "../_gen/prisma-class/shopping_list";

@Injectable()
export class ShoppingListsService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    email: string,
    createShoppingListDto: CreateShoppingListDto,
  ): Promise<ShoppingList> {
    return this.prisma.shoppingList.create({
      data: {
        name: createShoppingListDto.name,
        users: {
          connect: {
            email,
          },
        },
      },
    });
  }

  async findAll(email: string): Promise<ShoppingList[]> {
    return this.prisma.shoppingList.findMany({
      where: {
        users: {
          some: {
            email,
          },
        },
      },
    });
  }

  async findOne(email: string, id: string): Promise<ShoppingList> {
    const shoppingList = await this.prisma.shoppingList.findUnique({
      where: {
        id,
        users: {
          some: {
            email,
          },
        },
      },
    });

    if (!shoppingList) {
      throw new NotFoundException("Shopping list does not exist");
    }

    return shoppingList;
  }

  update(
    email: string,
    id: string,
    updateShoppingListDto: UpdateShoppingListDto,
  ): Promise<ShoppingList> {
    return this.prisma.shoppingList.update({
      data: {
        name: updateShoppingListDto.name,
      },
      where: {
        id,
        users: {
          some: {
            email,
          },
        },
      },
    });
  }

  remove(email: string, id: string): Promise<ShoppingList> {
    return this.prisma.shoppingList.delete({
      where: {
        id,
        users: {
          some: {
            email,
          },
        },
      },
    });
  }
}
