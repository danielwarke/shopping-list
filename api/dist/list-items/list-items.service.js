"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListItemsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const gateway_service_1 = require("../gateway/gateway.service");
let ListItemsService = class ListItemsService {
    constructor(prisma, gatewayService) {
        this.prisma = prisma;
        this.gatewayService = gatewayService;
    }
    findAll(userId, shoppingListId) {
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
    async create(userId, shoppingListId, createListItemDto) {
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
        let sortOrder = createListItemDto.sortOrder;
        if (!sortOrder) {
            sortOrder =
                shoppingList.listItems.length > 0
                    ? shoppingList.listItems[0].sortOrder + 1
                    : 1;
        }
        const createdListItem = await this.prisma.listItem.create({
            data: {
                shoppingListId,
                name: createListItemDto.name,
                sortOrder,
            },
        });
        this.gatewayService.onListUpdated(shoppingListId, userId);
        return createdListItem;
    }
    async rename(userId, shoppingListId, id, renameListItemDto) {
        const updatedListItem = await this.prisma.listItem.update({
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
        this.gatewayService.onListUpdated(shoppingListId, userId);
        return updatedListItem;
    }
    async toggleComplete(userId, shoppingListId, id) {
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
            throw new common_1.NotFoundException("List item does not exist");
        }
        const updatedList = await this.prisma.listItem.update({
            data: {
                complete: !listItem.complete,
            },
            where: {
                id: id,
            },
        });
        this.gatewayService.onListUpdated(shoppingListId, userId);
        return updatedList;
    }
    async remove(userId, shoppingListId, id) {
        const deletedListItem = await this.prisma.listItem.delete({
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
        this.gatewayService.onListUpdated(shoppingListId, userId);
        return deletedListItem;
    }
};
ListItemsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        gateway_service_1.GatewayService])
], ListItemsService);
exports.ListItemsService = ListItemsService;
//# sourceMappingURL=list-items.service.js.map