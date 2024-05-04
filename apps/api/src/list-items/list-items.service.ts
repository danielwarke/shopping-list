import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { ListItem } from "../_gen/prisma-class/list_item";
import { RenameListItemDto } from "./dto/rename-list-item.dto";
import { CreateListItemDto } from "./dto/create-list-item.dto";

@Injectable()
export class ListItemsService {
  constructor(private readonly prisma: PrismaService) {}

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
      orderBy: {
        sortOrder: "asc",
      },
    });
  }

  async create(
    userId: string,
    shoppingListId: string,
    createListItemDto: CreateListItemDto,
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

    return this.prisma.listItem.create({
      data: {
        shoppingListId,
        name: createListItemDto.name,
        sortOrder,
      },
    });
  }

  rename(
    userId: string,
    shoppingListId: string,
    id: string,
    renameListItemDto: RenameListItemDto,
  ): Promise<ListItem> {
    return this.prisma.listItem.update({
      data: {
        name: renameListItemDto.name,
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
  }

  async toggleComplete(
    userId: string,
    shoppingListId: string,
    id: string,
  ): Promise<ListItem> {
    const listItem = await this.prisma.listItem.findUnique({
      select: {
        complete: true,
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

    if (!listItem) {
      throw new NotFoundException("List item does not exist");
    }

    return this.prisma.listItem.update({
      data: {
        complete: !listItem.complete,
      },
      where: {
        id: id,
      },
    });
  }

  remove(
    userId: string,
    shoppingListId: string,
    id: string,
  ): Promise<ListItem> {
    return this.prisma.listItem.delete({
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
  }
}
