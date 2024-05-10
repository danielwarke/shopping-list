import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateShoppingListDto } from "./dto/create-shopping-list.dto";
import { UpdateShoppingListDto } from "./dto/update-shopping-list.dto";
import { PrismaService } from "../database/prisma.service";
import { ShoppingList } from "../_gen/prisma-class/shopping_list";
import { ReorderShoppingListDto } from "./dto/reorder-shopping-list.dto";
import { ListItem } from "src/_gen/prisma-class/list_item";
import { ShoppingListWithPreview } from "./dto/shopping-list-with-preview.dto";
import { JwtService } from "@nestjs/jwt";
import { ShareShoppingListDto } from "./dto/share-shopping-list.dto";
import { EmailsService } from "../emails/emails.service";
import { AcceptListInviteDto } from "./dto/accept-list-invite.dto";
import { ShoppingListWithMetadata } from "./dto/shopping-list-with-metadata.dto";

@Injectable()
export class ShoppingListsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailsService: EmailsService,
  ) {}

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

  async findAll(userId: string): Promise<ShoppingListWithPreview[]> {
    const shoppingLists = await this.prisma.shoppingList.findMany({
      include: {
        createdByUser: {
          select: {
            email: true,
            name: true,
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
        _count: { listItems: incompleteItemCount },
        ...rest
      } = shoppingList;

      return {
        ...rest,
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

  async share(
    userId: string,
    userName: string,
    id: string,
    shareShoppingListDto: ShareShoppingListDto,
  ) {
    // only allow the user who created the list to share it with other users
    const shoppingList = await this.prisma.shoppingList.findUniqueOrThrow({
      where: {
        id,
        createdByUserId: userId,
      },
    });

    const invitee = await this.prisma.user.findUnique({
      where: {
        email: shareShoppingListDto.otherUserEmail,
      },
    });

    if (invitee) {
      if (invitee.id === userId) {
        throw new ConflictException(
          "You can't share a shopping list with yourself",
        );
      }

      // we don't want the inviter to know if this was successful or not to avoid leaking user accounts
      try {
        const payload = { sub: invitee.id, shoppingListId: shoppingList.id };
        const token = this.jwtService.sign(payload);
        this.emailsService.shareShoppingList(
          invitee.email,
          userName,
          invitee.name,
          shoppingList.name,
          token,
        );
      } catch (e) {
        console.error(e);
      }
    }
  }

  async acceptInvite(
    userId: string,
    acceptListInviteDto: AcceptListInviteDto,
  ): Promise<ShoppingList> {
    const { token } = acceptListInviteDto;
    const { sub, shoppingListId } = await this.jwtService.verifyAsync<{
      sub: string;
      shoppingListId: string;
    }>(token);

    if (userId !== sub) {
      throw new ConflictException("Invalid token");
    }

    return this.prisma.shoppingList.update({
      data: {
        users: {
          connect: {
            id: userId,
          },
        },
      },
      where: {
        id: shoppingListId,
      },
    });
  }
}
