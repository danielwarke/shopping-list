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
import { GatewayService } from "../gateway/gateway.service";
export declare class ShoppingListsService {
    private readonly prisma;
    private readonly jwtService;
    private readonly emailsService;
    private readonly gatewayService;
    constructor(prisma: PrismaService, jwtService: JwtService, emailsService: EmailsService, gatewayService: GatewayService);
    create(userId: string, createShoppingListDto: CreateShoppingListDto): Promise<ShoppingList>;
    findAll(userId: string): Promise<ShoppingListWithPreview[]>;
    findOne(userId: string, id: string): Promise<ShoppingListWithMetadata>;
    rename(userId: string, id: string, updateShoppingListDto: UpdateShoppingListDto): Promise<ShoppingList>;
    reorder(userId: string, id: string, reorderListItemsDto: ReorderShoppingListDto): Promise<ListItem[]>;
    remove(userId: string, id: string): Promise<ShoppingList>;
    share(userId: string, userName: string, id: string, shareShoppingListDto: ShareShoppingListDto): Promise<void>;
    acceptInvite(userId: string, acceptListInviteDto: AcceptListInviteDto): Promise<ShoppingList>;
}
