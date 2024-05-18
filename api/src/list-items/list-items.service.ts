import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { ListItem } from "../_gen/prisma-class/list_item";
import { RenameListItemDto } from "./dto/rename-list-item.dto";
import { AppendListItemDto } from "./dto/append-list-item.dto";
import { GatewayService } from "../gateway/gateway.service";
import { SetListItemCompleteDto } from "./dto/set-list-item-complete.dto";
import { InsertListItemDto } from "./dto/insert-list-item.dto";

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

  async rename(
    userId: string,
    shoppingListId: string,
    id: string,
    renameListItemDto: RenameListItemDto,
  ): Promise<ListItem> {
    const { name } = renameListItemDto;

    const updatedListItem = await this.prisma.listItem.update({
      data: {
        name,
        shoppingList: {
          update: {
            createdAt: new Date(),
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

    this.gatewayService.onItemRenamed(shoppingListId, {
      userId,
      itemId: id,
      name,
    });

    return updatedListItem;
  }

  async setComplete(
    userId: string,
    shoppingListId: string,
    id: string,
    setListItemCompleteDto: SetListItemCompleteDto,
  ): Promise<ListItem> {
    const { complete } = setListItemCompleteDto;

    const updatedList = await this.prisma.listItem.update({
      data: {
        complete,
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
            some: { id: userId },
          },
        },
      },
    });

    this.gatewayService.onItemComplete(shoppingListId, {
      userId,
      itemId: id,
      complete,
    });

    return updatedList;
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
}
