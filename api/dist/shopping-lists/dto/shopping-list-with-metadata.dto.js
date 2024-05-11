"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingListWithMetadata = void 0;
const openapi = require("@nestjs/swagger");
const shopping_list_1 = require("../../_gen/prisma-class/shopping_list");
class ShoppingListWithMetadata extends shopping_list_1.ShoppingList {
    static _OPENAPI_METADATA_FACTORY() {
        return { isShared: { required: true, type: () => Boolean } };
    }
}
exports.ShoppingListWithMetadata = ShoppingListWithMetadata;
//# sourceMappingURL=shopping-list-with-metadata.dto.js.map