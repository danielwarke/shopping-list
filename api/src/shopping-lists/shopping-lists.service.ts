import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateShoppingListDto } from "./dto/create-shopping-list.dto";
import { UpdateShoppingListDto } from "./dto/update-shopping-list.dto";
import { PrismaService } from "../database/prisma.service";
import { ShoppingList } from "../_gen/prisma-class/shopping_list";
import { ShoppingListWithPreview } from "./dto/shopping-list-with-preview.dto";
import { ShoppingListWithMetadata } from "./dto/shopping-list-with-metadata.dto";
import { GatewayService } from "../gateway/gateway.service";
import { SetListColorDto } from "./dto/set-list-color.dto";
import { ListColor } from "../_gen/prisma-class/list_color";
import { ReorderListsDto } from "./dto/reorder-lists.dto";

@Injectable()
export class ShoppingListsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gatewayService: GatewayService,
  ) {}

  async create(
    userId: string,
    createShoppingListDto: CreateShoppingListDto,
  ): Promise<ShoppingList> {
    const maxSortOrder = await this.prisma.userListOrder.findFirst({
      select: {
        sortOrder: true,
      },
      where: {
        userId,
      },
      orderBy: {
        sortOrder: "desc",
      },
    });

    const sortOrder = maxSortOrder ? maxSortOrder.sortOrder + 1 : 1;

    return this.prisma.$transaction(async (tx) => {
      const createdList = await tx.shoppingList.create({
        data: {
          name: createShoppingListDto.name,
          listItems: {
            create: {
              sortOrder: 1,
              createdByUserId: userId,
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

      tx.userListOrder.create({
        data: {
          userId,
          shoppingListId: createdList.id,
          sortOrder,
        },
      });

      return createdList;
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
        color: true,
        listItems: {
          take: 3,
          where: {
            name: {
              not: "",
            },
          },
          orderBy: [
            {
              complete: "asc",
            },
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
                name: {
                  not: "",
                },
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
        createdAt: "desc",
      },
    });

    const mappedLists = shoppingLists.map((shoppingList) => {
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

    const shoppingListIds = mappedLists.map((list) => list.id);
    const listSortOrder = await this.prisma.userListOrder.findMany({
      where: {
        userId,
        shoppingListId: {
          in: shoppingListIds,
        },
      },
    });

    if (listSortOrder.length === 0) {
      return mappedLists;
    }

    const sortOrder: Record<string, number> = {};
    for (const order of listSortOrder) {
      sortOrder[order.shoppingListId] = order.sortOrder;
    }

    return mappedLists.sort((a, b) => sortOrder[a.id] - sortOrder[b.id]);
  }

  async findOne(userId: string, id: string): Promise<ShoppingListWithMetadata> {
    const shoppingList = await this.prisma.shoppingList.findUnique({
      include: {
        color: true,
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

  async reorder(
    userId: string,
    reorderListsDto: ReorderListsDto,
  ): Promise<ShoppingListWithPreview[]> {
    await this.prisma.$transaction(
      reorderListsDto.order.map(({ shoppingListId, sortOrder }) => {
        return this.prisma.userListOrder.upsert({
          create: {
            userId,
            shoppingListId,
            sortOrder,
          },
          update: {
            sortOrder,
          },
          where: {
            shoppingListId_userId: {
              userId,
              shoppingListId,
            },
          },
        });
      }),
    );

    return this.findAll(userId);
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

  async listColors(): Promise<ListColor[]> {
    return this.prisma.listColor.findMany();
  }

  async setColor(
    userId: string,
    id: string,
    setListColorDto: SetListColorDto,
  ): Promise<ShoppingList> {
    const { colorId } = setListColorDto;

    return this.prisma.shoppingList.update({
      data: {
        colorId: colorId ?? null,
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
}
