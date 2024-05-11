import { Socket, Server } from "socket.io";
export declare class GatewayService {
    server: Server;
    joinRoom(shoppingListId: string, socket: Socket): void;
    leaveRoom(shoppingListId: string, socket: Socket): void;
    onListUpdated(shoppingListId: string, userId: string): void;
}
