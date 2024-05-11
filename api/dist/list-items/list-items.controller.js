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
exports.ListItemsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const list_items_service_1 = require("./list-items.service");
const rename_list_item_dto_1 = require("./dto/rename-list-item.dto");
const create_list_item_dto_1 = require("./dto/create-list-item.dto");
const types_1 = require("../types");
const set_list_item_complete_dto_1 = require("./dto/set-list-item-complete.dto");
let ListItemsController = class ListItemsController {
    constructor(listItemsService) {
        this.listItemsService = listItemsService;
    }
    findAll(req, shoppingListId) {
        return this.listItemsService.findAll(req.user.userId, shoppingListId);
    }
    create(req, shoppingListId, createListItemDto) {
        return this.listItemsService.create(req.user.userId, shoppingListId, createListItemDto);
    }
    rename(req, shoppingListId, id, renameListItemDto) {
        return this.listItemsService.rename(req.user.userId, shoppingListId, id, renameListItemDto);
    }
    setComplete(req, shoppingListId, id, setListItemCompleteDto) {
        return this.listItemsService.setComplete(req.user.userId, shoppingListId, id, setListItemCompleteDto);
    }
    remove(req, shoppingListId, id) {
        return this.listItemsService.remove(req.user.userId, shoppingListId, id);
    }
};
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [require("../_gen/prisma-class/list_item").ListItem] }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("shoppingListId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.JwtRequest, String]),
    __metadata("design:returntype", void 0)
], ListItemsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../_gen/prisma-class/list_item").ListItem }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("shoppingListId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.JwtRequest, String, create_list_item_dto_1.CreateListItemDto]),
    __metadata("design:returntype", void 0)
], ListItemsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id/rename"),
    openapi.ApiResponse({ status: 200, type: require("../_gen/prisma-class/list_item").ListItem }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("shoppingListId")),
    __param(2, (0, common_1.Param)("id")),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.JwtRequest, String, String, rename_list_item_dto_1.RenameListItemDto]),
    __metadata("design:returntype", void 0)
], ListItemsController.prototype, "rename", null);
__decorate([
    (0, common_1.Patch)(":id/set-complete"),
    openapi.ApiResponse({ status: 200, type: require("../_gen/prisma-class/list_item").ListItem }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("shoppingListId")),
    __param(2, (0, common_1.Param)("id")),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.JwtRequest, String, String, set_list_item_complete_dto_1.SetListItemCompleteDto]),
    __metadata("design:returntype", void 0)
], ListItemsController.prototype, "setComplete", null);
__decorate([
    (0, common_1.Delete)(":id"),
    openapi.ApiResponse({ status: 200, type: require("../_gen/prisma-class/list_item").ListItem }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("shoppingListId")),
    __param(2, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.JwtRequest, String, String]),
    __metadata("design:returntype", void 0)
], ListItemsController.prototype, "remove", null);
ListItemsController = __decorate([
    (0, common_1.Controller)(),
    (0, swagger_1.ApiTags)("items"),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [list_items_service_1.ListItemsService])
], ListItemsController);
exports.ListItemsController = ListItemsController;
//# sourceMappingURL=list-items.controller.js.map