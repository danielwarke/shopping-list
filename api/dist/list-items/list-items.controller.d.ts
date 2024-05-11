import { ListItemsService } from "./list-items.service";
import { RenameListItemDto } from "./dto/rename-list-item.dto";
import { CreateListItemDto } from "./dto/create-list-item.dto";
import { JwtRequest } from "../types";
import { SetListItemCompleteDto } from "./dto/set-list-item-complete.dto";
export declare class ListItemsController {
    private readonly listItemsService;
    constructor(listItemsService: ListItemsService);
    findAll(req: JwtRequest, shoppingListId: string): Promise<import("../_gen/prisma-class/list_item").ListItem[]>;
    create(req: JwtRequest, shoppingListId: string, createListItemDto: CreateListItemDto): Promise<import("../_gen/prisma-class/list_item").ListItem>;
    rename(req: JwtRequest, shoppingListId: string, id: string, renameListItemDto: RenameListItemDto): Promise<import("../_gen/prisma-class/list_item").ListItem>;
    setComplete(req: JwtRequest, shoppingListId: string, id: string, setListItemCompleteDto: SetListItemCompleteDto): Promise<import("../_gen/prisma-class/list_item").ListItem>;
    remove(req: JwtRequest, shoppingListId: string, id: string): Promise<import("../_gen/prisma-class/list_item").ListItem>;
}
