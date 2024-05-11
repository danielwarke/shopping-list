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
exports.ListItem = void 0;
const swagger_1 = require("@nestjs/swagger");
class ListItem {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ListItem.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ListItem.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    __metadata("design:type", Boolean)
], ListItem.prototype, "complete", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ListItem.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ListItem.prototype, "shoppingListId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], ListItem.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Date }),
    __metadata("design:type", Date)
], ListItem.prototype, "updatedAt", void 0);
exports.ListItem = ListItem;
//# sourceMappingURL=list_item.js.map