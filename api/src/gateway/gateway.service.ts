import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import {
  ItemCompletePayload,
  ItemRenamedPayload,
  ItemUpdatedPayload,
  ServerToClientEvents,
} from "./types";

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_DOMAIN,
  },
})
export class GatewayService {
  @WebSocketServer()
  server: Server<undefined, ServerToClientEvents>;

  @SubscribeMessage("joinRoom")
  joinRoom(
    @MessageBody() shoppingListId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(shoppingListId);
  }

  @SubscribeMessage("leaveRoom")
  leaveRoom(
    @MessageBody() shoppingListId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave(shoppingListId);
  }

  onListUpdated(shoppingListId: string, userId: string) {
    this.server.to(shoppingListId).emit("listUpdated", { userId });
  }

  onItemDeleted(shoppingListId: string, payload: ItemUpdatedPayload) {
    this.server.to(shoppingListId).emit("itemDeleted", payload);
  }

  onItemRenamed(shoppingListId: string, payload: ItemRenamedPayload) {
    this.server.to(shoppingListId).emit("itemRenamed", payload);
  }

  onItemComplete(shoppingListId: string, payload: ItemCompletePayload) {
    this.server.to(shoppingListId).emit("itemComplete", payload);
  }
}
