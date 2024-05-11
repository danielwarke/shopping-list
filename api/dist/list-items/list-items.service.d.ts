import { PrismaService } from "../database/prisma.service";
import { ListItem } from "../_gen/prisma-class/list_item";
import { RenameListItemDto } from "./dto/rename-list-item.dto";
import { CreateListItemDto } from "./dto/create-list-item.dto";
import { GatewayService } from "../gateway/gateway.service";
import { SetListItemCompleteDto } from "./dto/set-list-item-complete.dto";
export declare class ListItemsService {
    private readonly prisma;
    private readonly gatewayService;
    constructor(prisma: PrismaService, gatewayService: GatewayService);
    findAll(userId: string, shoppingListId: string): Promise<ListItem[]>;
    create(userId: string, shoppingListId: string, createListItemDto: CreateListItemDto): Promise<ListItem>;
    rename(userId: string, shoppingListId: string, id: string, renameListItemDto: RenameListItemDto): Promise<ListItem>;
    setComplete(userId: string, shoppingListId: string, id: string, setListItemCompleteDto: SetListItemCompleteDto): Promise<ListItem>;
    remove(userId: string, shoppingListId: string, id: string): Promise<ListItem>;
}
