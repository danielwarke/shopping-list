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
exports.GatewayService = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let GatewayService = class GatewayService {
    joinRoom(shoppingListId, socket) {
        socket.join(shoppingListId);
    }
    leaveRoom(shoppingListId, socket) {
        socket.leave(shoppingListId);
    }
    onListUpdated(shoppingListId, userId) {
        this.server.to(shoppingListId).emit("list_updated", { userId });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GatewayService.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("join_room"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GatewayService.prototype, "joinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("leave_room"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GatewayService.prototype, "leaveRoom", null);
GatewayService = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CLIENT_DOMAIN,
        },
    })
], GatewayService);
exports.GatewayService = GatewayService;
//# sourceMappingURL=gateway.service.js.map