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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingListsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const shopping_lists_service_1 = require("./shopping-lists.service");
const create_shopping_list_dto_1 = require("./dto/create-shopping-list.dto");
const update_shopping_list_dto_1 = require("./dto/update-shopping-list.dto");
const swagger_1 = require("@nestjs/swagger");
const reorder_shopping_list_dto_1 = require("./dto/reorder-shopping-list.dto");
const types_1 = require("../types");
const share_shopping_list_dto_1 = require("./dto/share-shopping-list.dto");
const accept_list_invite_dto_1 = require("./dto/accept-list-invite.dto");
let ShoppingListsController = class ShoppingListsController {
    constructor(shoppingListsService) {
        this.shoppingListsService = shoppingListsService;
    }
    create(req, createShoppingListDto) {
        return this.shoppingListsService.create(req.user.userId, createShoppingListDto);
    }
    findAll(req) {
        return this.shoppingListsService.findAll(req.user.userId);
    }
    findOne(req, id) {
        return this.shoppingListsService.findOne(req.user.userId, id);
    }
    rename(req, id, updateShoppingListDto) {
        return this.shoppingListsService.rename(req.user.userId, id, updateShoppingListDto);
    }
    reorder(req, id, reorderShoppingListDto) {
        return this.shoppingListsService.reorder(req.user.userId, id, reorderShoppingListDto);
    }
    remove(req, id) {
        return this.shoppingListsService.remove(req.user.userId, id);
    }
    share(req, id, shareShoppingListDto) {
        const { userId, name } = req.user;
        return this.shoppingListsService.share(userId, name, id, shareShoppingListDto);
    }
    acceptInvite(req, acceptListInviteDto) {
        return this.shoppingListsService.acceptInvite(req.user.userId, acceptListInviteDto);
    }
};
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../_gen/prisma-class/shopping_list").ShoppingList }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.JwtRequest,
        create_shopping_list_dto_1.CreateShoppingListDto]),
    __metadata("design:returntype", void 0)
], ShoppingListsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [require("./dto/shopping-list-with-preview.dto").ShoppingListWithPreview] }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.JwtRequest]),
    __metadata("design:returntype", void 0)
], ShoppingListsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    openapi.ApiResponse({ status: 200, type: require("./dto/shopping-list-with-metadata.dto").ShoppingListWithMetadata }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.JwtRequest, String]),
    __metadata("design:returntype", void 0)
], ShoppingListsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id/rename"),
    openapi.ApiResponse({ status: 200, type: require("../_gen/prisma-class/shopping_list").ShoppingList }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.JwtRequest, String, update_shopping_list_dto_1.UpdateShoppingListDto]),
    __metadata("design:returntype", void 0)
], ShoppingListsController.prototype, "rename", null);
__decorate([
    (0, common_1.Patch)(":id/reorder"),
    openapi.ApiResponse({ status: 200, type: [require("../_gen/prisma-class/list_item").ListItem] }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.JwtRequest, String, reorder_shopping_list_dto_1.ReorderShoppingListDto]),
    __metadata("design:returntype", void 0)
], ShoppingListsController.prototype, "reorder", null);
__decorate([
    (0, common_1.Delete)(":id"),
    openapi.ApiResponse({ status: 200, type: require("../_gen/prisma-class/shopping_list").ShoppingList }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.JwtRequest, String]),
    __metadata("design:returntype", void 0)
], ShoppingListsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(":id/share"),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.JwtRequest, String, share_shopping_list_dto_1.ShareShoppingListDto]),
    __metadata("design:returntype", void 0)
], ShoppingListsController.prototype, "share", null);
__decorate([
    (0, common_1.Post)("accept-invite"),
    openapi.ApiResponse({ status: 201, type: require("../_gen/prisma-class/shopping_list").ShoppingList }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.JwtRequest,
        accept_list_invite_dto_1.AcceptListInviteDto]),
    __metadata("design:returntype", void 0)
], ShoppingListsController.prototype, "acceptInvite", null);
ShoppingListsController = __decorate([
    (0, common_1.Controller)(),
    (0, swagger_1.ApiTags)("shopping-lists"),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [shopping_lists_service_1.ShoppingListsService])
], ShoppingListsController);
exports.ShoppingListsController = ShoppingListsController;
//# sourceMappingURL=shopping-lists.controller.js.map