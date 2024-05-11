"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingListWithPreview = void 0;
const openapi = require("@nestjs/swagger");
const shopping_list_1 = require("../../_gen/prisma-class/shopping_list");
const swagger_1 = require("@nestjs/swagger");
const user_1 = require("../../_gen/prisma-class/user");
class CreatedByUser extends (0, swagger_1.PickType)(user_1.User, ["name", "email"]) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
class ShoppingListWithPreview extends shopping_list_1.ShoppingList {
    static _OPENAPI_METADATA_FACTORY() {
        return { createdByUser: { required: true, type: () => CreatedByUser }, listItemsPreview: { required: true, type: () => [require("../../_gen/prisma-class/list_item").ListItem] }, incompleteItemCount: { required: true, type: () => Number } };
    }
}
exports.ShoppingListWithPreview = ShoppingListWithPreview;
//# sourceMappingURL=shopping-list-with-preview.dto.js.map