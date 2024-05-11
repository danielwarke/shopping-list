"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateShoppingListDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_shopping_list_dto_1 = require("./create-shopping-list.dto");
class UpdateShoppingListDto extends (0, swagger_1.PartialType)(create_shopping_list_dto_1.CreateShoppingListDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateShoppingListDto = UpdateShoppingListDto;
//# sourceMappingURL=update-shopping-list.dto.js.map