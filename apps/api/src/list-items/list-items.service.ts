import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { ListItem } from "../_gen/prisma-class/list_item";
import { RenameListItemDto } from "./dto/rename-list-item.dto";
import { CreateShoppingListDto } from "../shopping-lists/dto/create-shopping-list.dto";

@Injectable()
export class ListItemsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(email: string, shoppingListId: string): Promise<ListItem[]> {
    return this.prisma.listItem.findMany({
      where: {
        shoppingList: {
          id: shoppingListId,
          users: {
            some: { email },
          },
        },
      },
      orderBy: {
        sortOrder: "asc",
      },
    });
  }

  async create(
    email: string,
    shoppingListId: string,
    createShoppingListDto: CreateShoppingListDto,
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
          some: { email },
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
        name: createShoppingListDto.name,
        sortOrder,
      },
    });
  }

  rename(
    email: string,
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
              email,
            },
          },
        },
      },
    });
  }

  async toggleComplete(
    email: string,
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
            some: { email },
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

  remove(email: string, shoppingListId: string, id: string): Promise<ListItem> {
    return this.prisma.listItem.delete({
      where: {
        id: id,
        shoppingList: {
          id: shoppingListId,
          users: {
            some: { email },
          },
        },
      },
    });
  }
}
