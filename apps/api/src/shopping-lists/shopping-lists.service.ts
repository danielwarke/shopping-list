import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateShoppingListDto } from "./dto/create-shopping-list.dto";
import { UpdateShoppingListDto } from "./dto/update-shopping-list.dto";
import { PrismaService } from "../database/prisma.service";
import { ShoppingList } from "../_gen/prisma-class/shopping_list";
import { ReorderShoppingListDto } from "./dto/reorder-shopping-list.dto";
import { ListItem } from "src/_gen/prisma-class/list_item";

@Injectable()
export class ShoppingListsService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    userId: string,
    createShoppingListDto: CreateShoppingListDto,
  ): Promise<ShoppingList> {
    return this.prisma.shoppingList.create({
      data: {
        name: createShoppingListDto.name,
        users: {
          connect: {
            id: userId,
          },
        },
        createdByUserId: userId,
      },
    });
  }

  async findAll(userId: string): Promise<ShoppingList[]> {
    return this.prisma.shoppingList.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
  }

  async findOne(userId: string, id: string): Promise<ShoppingList> {
    const shoppingList = await this.prisma.shoppingList.findUnique({
      where: {
        id,
        users: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (!shoppingList) {
      throw new NotFoundException("Shopping list does not exist");
    }

    return shoppingList;
  }

  rename(
    userId: string,
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
            id: userId,
          },
        },
      },
    });
  }

  reorder(
    userId: string,
    id: string,
    reorderListItemsDto: ReorderShoppingListDto,
  ): Promise<ListItem[]> {
    return this.prisma.$transaction(
      reorderListItemsDto.order
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((reorderItem) => {
          return this.prisma.listItem.update({
            data: {
              sortOrder: reorderItem.sortOrder,
            },
            where: {
              id: reorderItem.listItemId,
              shoppingList: {
                id: id,
                users: {
                  some: { id: userId },
                },
              },
            },
          });
        }),
    );
  }

  remove(userId: string, id: string): Promise<ShoppingList> {
    return this.prisma.shoppingList.delete({
      where: {
        id,
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
  }
}
