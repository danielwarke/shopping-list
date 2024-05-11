import { ShoppingListsService } from "./shopping-lists.service";
import { CreateShoppingListDto } from "./dto/create-shopping-list.dto";
import { UpdateShoppingListDto } from "./dto/update-shopping-list.dto";
import { ReorderShoppingListDto } from "./dto/reorder-shopping-list.dto";
import { JwtRequest } from "../types";
import { ShareShoppingListDto } from "./dto/share-shopping-list.dto";
import { AcceptListInviteDto } from "./dto/accept-list-invite.dto";
export declare class ShoppingListsController {
    private readonly shoppingListsService;
    constructor(shoppingListsService: ShoppingListsService);
    create(req: JwtRequest, createShoppingListDto: CreateShoppingListDto): Promise<import("../_gen/prisma-class/shopping_list").ShoppingList>;
    findAll(req: JwtRequest): Promise<import("./dto/shopping-list-with-preview.dto").ShoppingListWithPreview[]>;
    findOne(req: JwtRequest, id: string): Promise<import("./dto/shopping-list-with-metadata.dto").ShoppingListWithMetadata>;
    rename(req: JwtRequest, id: string, updateShoppingListDto: UpdateShoppingListDto): Promise<import("../_gen/prisma-class/shopping_list").ShoppingList>;
    reorder(req: JwtRequest, id: string, reorderShoppingListDto: ReorderShoppingListDto): Promise<import("../_gen/prisma-class/list_item").ListItem[]>;
    remove(req: JwtRequest, id: string): Promise<import("../_gen/prisma-class/shopping_list").ShoppingList>;
    share(req: JwtRequest, id: string, shareShoppingListDto: ShareShoppingListDto): Promise<void>;
    acceptInvite(req: JwtRequest, acceptListInviteDto: AcceptListInviteDto): Promise<import("../_gen/prisma-class/shopping_list").ShoppingList>;
}
