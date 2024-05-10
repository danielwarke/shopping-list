import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_DOMAIN,
  },
})
export class GatewayService {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage("join_room")
  joinRoom(
    @MessageBody() shoppingListId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(shoppingListId);
  }

  @SubscribeMessage("leave_room")
  leaveRoom(
    @MessageBody() shoppingListId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave(shoppingListId);
  }

  onListUpdated(shoppingListId: string, userId: string) {
    this.server.to(shoppingListId).emit("list_updated", { userId });
  }
}
