import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { ShoppingList } from "../_gen/prisma-class/shopping_list";
import { JwtService } from "@nestjs/jwt";
import { EmailsService } from "../emails/emails.service";
import { ShareShoppingListDto } from "./dto/share-shopping-list.dto";
import { AcceptListInviteDto } from "./dto/accept-list-invite.dto";
import { RevokeAccessDto } from "./dto/revoke-access.dto";

@Injectable()
export class ListSharingService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailsService: EmailsService,
  ) {}

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
        email: shareShoppingListDto.email,
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

  async revokeAccess(
    userId: string,
    id: string,
    revokeAccessDto: RevokeAccessDto,
  ): Promise<ShoppingList> {
    return this.prisma.shoppingList.update({
      data: {
        users: {
          disconnect: {
            email: revokeAccessDto.email,
          },
        },
      },
      where: {
        createdByUserId: userId,
        id,
      },
    });
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
