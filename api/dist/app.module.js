"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const core_1 = require("@nestjs/core");
const guards_1 = require("./common/guards");
const shopping_lists_module_1 = require("./shopping-lists/shopping-lists.module");
const list_items_module_1 = require("./list-items/list-items.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            shopping_lists_module_1.ShoppingListsModule,
            list_items_module_1.ListItemsModule,
            core_1.RouterModule.register([
                {
                    path: "auth",
                    module: auth_module_1.AuthModule,
                },
                {
                    path: "shopping-lists",
                    module: shopping_lists_module_1.ShoppingListsModule,
                    children: [
                        {
                            path: ":shoppingListId/items",
                            module: list_items_module_1.ListItemsModule,
                        },
                    ],
                },
            ]),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, { provide: core_1.APP_GUARD, useClass: guards_1.JwtAuthGuard }],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map