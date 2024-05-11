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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingListsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const emails_service_1 = require("../emails/emails.service");
const gateway_service_1 = require("../gateway/gateway.service");
let ShoppingListsService = class ShoppingListsService {
    constructor(prisma, jwtService, emailsService, gatewayService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.emailsService = emailsService;
        this.gatewayService = gatewayService;
    }
    create(userId, createShoppingListDto) {
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
    async findAll(userId) {
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
            const { listItems: listItemsPreview, _count: { listItems: incompleteItemCount } } = shoppingList, rest = __rest(shoppingList, ["listItems", "_count"]);
            return Object.assign(Object.assign({}, rest), { listItemsPreview,
                incompleteItemCount });
        });
    }
    async findOne(userId, id) {
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
            throw new common_1.NotFoundException("Shopping list does not exist");
        }
        const { _count: { users } } = shoppingList, rest = __rest(shoppingList, ["_count"]);
        return Object.assign({ isShared: users > 1 }, rest);
    }
    rename(userId, id, updateShoppingListDto) {
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
    async reorder(userId, id, reorderListItemsDto) {
        const updatedListItems = await this.prisma.$transaction(reorderListItemsDto.order
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
        }));
        this.gatewayService.onListUpdated(id, userId);
        return updatedListItems;
    }
    async remove(userId, id) {
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
        if (shoppingList.createdByUserId === userId) {
            return this.prisma.shoppingList.delete({
                where: {
                    id,
                },
            });
        }
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
    async share(userId, userName, id, shareShoppingListDto) {
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
                throw new common_1.ConflictException("You can't share a shopping list with yourself");
            }
            try {
                const payload = { sub: invitee.id, shoppingListId: shoppingList.id };
                const token = this.jwtService.sign(payload);
                this.emailsService.shareShoppingList(invitee.email, userName, invitee.name, shoppingList.name, token);
            }
            catch (e) {
                console.error(e);
            }
        }
    }
    async acceptInvite(userId, acceptListInviteDto) {
        const { token } = acceptListInviteDto;
        const { sub, shoppingListId } = await this.jwtService.verifyAsync(token);
        if (userId !== sub) {
            throw new common_1.ConflictException("Invalid token");
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
};
ShoppingListsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        emails_service_1.EmailsService,
        gateway_service_1.GatewayService])
], ShoppingListsService);
exports.ShoppingListsService = ShoppingListsService;
//# sourceMappingURL=shopping-lists.service.js.map