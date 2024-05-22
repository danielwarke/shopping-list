import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { ListItem } from "../_gen/prisma-class/list_item";
import { AppendListItemDto } from "./dto/append-list-item.dto";
import { GatewayService } from "../gateway/gateway.service";
import { InsertListItemDto } from "./dto/insert-list-item.dto";
import { ReorderShoppingListDto } from "./dto/reorder-shopping-list.dto";
import { UpdateListItemDto } from "./dto/update-list-item.dto";

@Injectable()
export class ListItemsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gatewayService: GatewayService,
  ) {}

  findAll(userId: string, shoppingListId: string): Promise<ListItem[]> {
    return this.prisma.listItem.findMany({
      where: {
        shoppingList: {
          id: shoppingListId,
          users: {
            some: { id: userId },
          },
        },
      },
      orderBy: [
        {
          sortOrder: "asc",
        },
        { createdAt: "asc" },
      ],
    });
  }

  async append(
    userId: string,
    shoppingListId: string,
    appendListItemDto: AppendListItemDto,
  ): Promise<ListItem> {
    const shoppingList = await this.prisma.shoppingList.findUniqueOrThrow({
      select: {
        listItems: {
          take: 1,
          select: {
            sortOrder: true,
          },
          orderBy: {
            sortOrder: "desc",
          },
        },
      },
      where: {
        id: shoppingListId,
        users: {
          some: { id: userId },
        },
      },
    });

    const sortOrder =
      shoppingList.listItems.length > 0
        ? shoppingList.listItems[0].sortOrder + 1
        : 1;

    const [createdListItem] = await this.prisma.$transaction([
      this.prisma.listItem.create({
        data: {
          shoppingListId,
          name: appendListItemDto.name,
          sortOrder,
        },
      }),
      this.prisma.shoppingList.update({
        data: {
          updatedAt: new Date(),
        },
        where: {
          id: shoppingListId,
        },
      }),
    ]);

    this.gatewayService.onItemAppended(shoppingListId, {
      userId,
      appendedItem: createdListItem,
    });

    return createdListItem;
  }

  async insert(
    userId: string,
    shoppingListId: string,
    insertListItemDto: InsertListItemDto,
  ): Promise<ListItem[]> {
    const [_, shoppingList] = await this.prisma.$transaction([
      this.prisma.listItem.create({
        data: {
          shoppingListId,
          name: insertListItemDto.name,
          sortOrder: insertListItemDto.sortOrder,
        },
      }),
      this.prisma.shoppingList.update({
        include: {
          listItems: {
            select: {
              id: true,
            },
            orderBy: [
              {
                sortOrder: "asc",
              },
              { createdAt: "asc" },
            ],
          },
        },
        data: {
          updatedAt: new Date(),
        },
        where: {
          id: shoppingListId,
          users: {
            some: { id: userId },
          },
        },
      }),
    ]);

    const updatedListItems = await this.prisma.$transaction(
      shoppingList.listItems.map((listItem, index) => {
        return this.prisma.listItem.update({
          data: {
            sortOrder: index + 1,
          },
          where: {
            id: listItem.id,
          },
        });
      }),
    );

    this.gatewayService.onListReordered(shoppingListId, {
      userId,
      reorderedList: updatedListItems.sort((a, b) => a.sortOrder - b.sortOrder),
    });

    return updatedListItems;
  }

  async update(
    userId: string,
    shoppingListId: string,
    id: string,
    updateListItemDto: UpdateListItemDto,
  ): Promise<ListItem> {
    const updatedListItem = await this.prisma.listItem.update({
      data: {
        ...updateListItemDto,
        shoppingList: {
          update: {
            updatedAt: new Date(),
          },
        },
      },
      where: {
        id: id,
        shoppingList: {
          id: shoppingListId,
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
    });

    this.gatewayService.onItemUpdated(shoppingListId, {
      userId,
      itemId: id,
      ...updateListItemDto,
    });

    return updatedListItem;
  }

  async reorder(
    userId: string,
    shoppingListId: string,
    reorderListItemsDto: ReorderShoppingListDto,
  ): Promise<ListItem[]> {
    const shoppingList = await this.prisma.shoppingList.findUnique({
      where: {
        id: shoppingListId,
        users: {
          some: { id: userId },
        },
      },
    });

    if (!shoppingList) {
      throw new NotFoundException("Shopping list does not exist");
    }

    const updatedListItems = await this.prisma.$transaction(
      reorderListItemsDto.order
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((reorderItem) => {
          return this.prisma.listItem.update({
            data: {
              sortOrder: reorderItem.sortOrder,
            },
            where: {
              id: reorderItem.listItemId,
              shoppingListId,
            },
          });
        }),
    );

    await this.prisma.shoppingList.update({
      data: { updatedAt: new Date() },
      where: { id: shoppingListId },
    });

    this.gatewayService.onListReordered(shoppingListId, {
      userId,
      reorderedList: updatedListItems,
    });

    return updatedListItems;
  }

  async remove(
    userId: string,
    shoppingListId: string,
    id: string,
  ): Promise<ListItem> {
    const [deletedListItem] = await this.prisma.$transaction([
      this.prisma.listItem.delete({
        where: {
          id: id,
          shoppingList: {
            id: shoppingListId,
            users: {
              some: { id: userId },
            },
          },
        },
      }),
      this.prisma.shoppingList.update({
        data: {
          updatedAt: new Date(),
        },
        where: {
          id: shoppingListId,
        },
      }),
    ]);

    this.gatewayService.onItemsDeleted(shoppingListId, {
      userId,
      itemIds: [id],
    });

    return deletedListItem;
  }

  async removeCompleteItems(
    userId: string,
    shoppingListId: string,
  ): Promise<ListItem[]> {
    const shoppingList = await this.prisma.shoppingList.findUnique({
      include: {
        listItems: {
          where: {
            complete: true,
          },
        },
      },
      where: {
        id: shoppingListId,
        users: {
          some: { id: userId },
        },
      },
    });

    if (!shoppingList) {
      throw new NotFoundException("Shopping list does not exist");
    }

    if (shoppingList.listItems.length === 0) {
      throw new UnprocessableEntityException("No items found to delete");
    }

    await this.prisma.$transaction([
      this.prisma.listItem.deleteMany({
        where: {
          shoppingListId,
          complete: true,
        },
      }),
      this.prisma.shoppingList.update({
        data: {
          updatedAt: new Date(),
        },
        where: {
          id: shoppingListId,
        },
      }),
    ]);

    const deletedItemIds = shoppingList.listItems.map((item) => item.id);

    this.gatewayService.onItemsDeleted(shoppingListId, {
      userId,
      itemIds: deletedItemIds,
    });

    return shoppingList.listItems;
  }
}
