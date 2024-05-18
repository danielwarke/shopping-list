import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import {
  ItemAppendedPayload,
  ItemCompletePayload,
  ItemRenamedPayload,
  ItemsDeletedPayload,
  ItemUpdatedPayload,
  ListRenamedPayload,
  ListReorderedPayload,
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

  onListRenamed(shoppingListId: string, payload: ListRenamedPayload) {
    this.server.to(shoppingListId).emit("listRenamed", payload);
  }

  onListReordered(shoppingListId: string, payload: ListReorderedPayload) {
    this.server.to(shoppingListId).emit("listReordered", payload);
  }

  onItemAppended(shoppingListId: string, payload: ItemAppendedPayload) {
    this.server.to(shoppingListId).emit("itemAppended", payload);
  }

  onItemsDeleted(shoppingListId: string, payload: ItemsDeletedPayload) {
    this.server.to(shoppingListId).emit("itemsDeleted", payload);
  }

  onItemRenamed(shoppingListId: string, payload: ItemRenamedPayload) {
    this.server.to(shoppingListId).emit("itemRenamed", payload);
  }

  onItemComplete(shoppingListId: string, payload: ItemCompletePayload) {
    this.server.to(shoppingListId).emit("itemComplete", payload);
  }
}
