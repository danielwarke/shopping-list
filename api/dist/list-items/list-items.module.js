"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListItemsModule = void 0;
const common_1 = require("@nestjs/common");
const list_items_service_1 = require("./list-items.service");
const list_items_controller_1 = require("./list-items.controller");
const gateway_module_1 = require("../gateway/gateway.module");
let ListItemsModule = class ListItemsModule {
};
ListItemsModule = __decorate([
    (0, common_1.Module)({
        imports: [gateway_module_1.GatewayModule],
        controllers: [list_items_controller_1.ListItemsController],
        providers: [list_items_service_1.ListItemsService],
    })
], ListItemsModule);
exports.ListItemsModule = ListItemsModule;
//# sourceMappingURL=list-items.module.js.map