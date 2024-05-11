"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingListsModule = void 0;
const common_1 = require("@nestjs/common");
const shopping_lists_service_1 = require("./shopping-lists.service");
const shopping_lists_controller_1 = require("./shopping-lists.controller");
const emails_module_1 = require("../emails/emails.module");
const gateway_module_1 = require("../gateway/gateway.module");
let ShoppingListsModule = class ShoppingListsModule {
};
ShoppingListsModule = __decorate([
    (0, common_1.Module)({
        imports: [emails_module_1.EmailsModule, gateway_module_1.GatewayModule],
        controllers: [shopping_lists_controller_1.ShoppingListsController],
        providers: [shopping_lists_service_1.ShoppingListsService],
    })
], ShoppingListsModule);
exports.ShoppingListsModule = ShoppingListsModule;
//# sourceMappingURL=shopping-lists.module.js.map