import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
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
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailsService: EmailsService,
  ) {}

  async share(
    userId: string,
    userName: string,
    id: string,
    shareShoppingListDto: ShareShoppingListDto,
  ) {
    const { emailVerified } = await this.prisma.user.findUniqueOrThrow({
      select: {
        emailVerified: true,
      },
      where: {
        id: userId,
      },
    });

    if (!emailVerified) {
      throw new UnauthorizedException(
        "You must verify your email address before sharing lists",
      );
    }

    // only allow the user who created the list to share it with other users
    const shoppingList = await this.prisma.shoppingList.findUniqueOrThrow({
      where: {
        id,
        createdByUserId: userId,
      },
    });

    const { email: inviteeEmail } = shareShoppingListDto;

    const invitee = await this.prisma.user.findUnique({
      where: {
        email: inviteeEmail,
      },
    });

    if (!invitee) {
      const payload = {
        sub: inviteeEmail,
        shoppingListId: shoppingList.id,
      };
      const token = this.jwtService.sign(payload);
      this.emailsService.inviteToApp(
        inviteeEmail,
        userName,
        shoppingList.name,
        token,
      );
      return;
    }

    if (invitee.id === userId) {
      throw new ConflictException(
        "You can't share a shopping list with yourself",
      );
    }

    const payload = { sub: invitee.id, shoppingListId: shoppingList.id };
    const token = this.jwtService.sign(payload);
    this.emailsService.shareShoppingList(
      inviteeEmail,
      userName,
      invitee.name,
      shoppingList.name,
      token,
    );
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
