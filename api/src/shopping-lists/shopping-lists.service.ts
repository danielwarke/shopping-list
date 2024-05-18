import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateShoppingListDto } from "./dto/create-shopping-list.dto";
import { UpdateShoppingListDto } from "./dto/update-shopping-list.dto";
import { PrismaService } from "../database/prisma.service";
import { ShoppingList } from "../_gen/prisma-class/shopping_list";
import { ShoppingListWithPreview } from "./dto/shopping-list-with-preview.dto";
import { ShoppingListWithMetadata } from "./dto/shopping-list-with-metadata.dto";
import { GatewayService } from "../gateway/gateway.service";

@Injectable()
export class ShoppingListsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gatewayService: GatewayService,
  ) {}

  create(
    userId: string,
    createShoppingListDto: CreateShoppingListDto,
  ): Promise<ShoppingList> {
    return this.prisma.shoppingList.create({
      data: {
        name: createShoppingListDto.name,
        listItems: {
          create: {
            sortOrder: 1,
          },
        },
        users: {
          connect: {
            id: userId,
          },
        },
        createdByUserId: userId,
      },
    });
  }

  async findAll(userId: string): Promise<ShoppingListWithPreview[]> {
    const shoppingLists = await this.prisma.shoppingList.findMany({
      include: {
        createdByUser: {
          select: {
            email: true,
            name: true,
          },
        },
        users: {
          select: {
            email: true,
            name: true,
          },
          where: {
            id: {
              not: userId,
            },
          },
        },
        listItems: {
          take: 3,
          where: {
            complete: false,
            name: {
              not: "",
            },
          },
          orderBy: [
            {
              sortOrder: "asc",
            },
            { createdAt: "asc" },
          ],
        },
        _count: {
          select: {
            listItems: {
              where: {
                complete: false,
              },
            },
          },
        },
      },
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return shoppingLists.map((shoppingList) => {
      const {
        listItems: listItemsPreview,
        users,
        createdByUserId,
        _count: { listItems: incompleteItemCount },
        ...rest
      } = shoppingList;

      const createdByCurrentUser = createdByUserId === userId;
      const sharedWithUsers = createdByCurrentUser ? users : [];

      return {
        ...rest,
        sharedWithUsers,
        listItemsPreview,
        incompleteItemCount,
      };
    });
  }

  async findOne(userId: string, id: string): Promise<ShoppingListWithMetadata> {
    const shoppingList = await this.prisma.shoppingList.findUnique({
      include: {
        _count: {
          select: {
            users: true,
          },
        },
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

    if (!shoppingList) {
      throw new NotFoundException("Shopping list does not exist");
    }

    const {
      _count: { users },
      ...rest
    } = shoppingList;

    return {
      isShared: users > 1,
      ...rest,
    };
  }

  async rename(
    userId: string,
    id: string,
    updateShoppingListDto: UpdateShoppingListDto,
  ): Promise<ShoppingList> {
    const { name } = updateShoppingListDto;

    const updatedShoppingList = await this.prisma.shoppingList.update({
      data: {
        name,
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

    this.gatewayService.onListRenamed(id, { userId, name });

    return updatedShoppingList;
  }

  async remove(userId: string, id: string): Promise<ShoppingList> {
    const shoppingList = await this.prisma.shoppingList.findUniqueOrThrow({
      where: {
        id,
        users: {
          some: {
            id: userId,
          },
        },
      },
    });

    // if the current user created the shopping list, delete is for all users
    if (shoppingList.createdByUserId === userId) {
      return this.prisma.shoppingList.delete({
        where: {
          id,
        },
      });
    }

    // if current user did not delete shopping list, just remove their access
    return this.prisma.shoppingList.update({
      data: {
        users: {
          disconnect: {
            id: userId,
          },
        },
      },
      where: {
        id,
      },
    });
  }
}
