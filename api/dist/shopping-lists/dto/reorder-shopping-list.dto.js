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
exports.ReorderShoppingListDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ReorderItem {
    static _OPENAPI_METADATA_FACTORY() {
        return { listItemId: { required: true, type: () => String }, sortOrder: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReorderItem.prototype, "listItemId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ReorderItem.prototype, "sortOrder", void 0);
class ReorderShoppingListDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { order: { required: true, type: () => [ReorderItem] } };
    }
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => ReorderItem),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], ReorderShoppingListDto.prototype, "order", void 0);
exports.ReorderShoppingListDto = ReorderShoppingListDto;
//# sourceMappingURL=reorder-shopping-list.dto.js.map