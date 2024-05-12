import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/hooks/use-auth";
import { useSetItemData } from "@/hooks/use-set-item-data";
import { useQueryClient } from "@tanstack/react-query";
import { getItemsQueryKey, getShoppingListQueryKey } from "@/api/query-keys";
import { ShoppingListWithMetadata } from "@/api/client-sdk/Api";

interface ListRenamedPayload {
  userId: string;
  name: string;
}

interface ItemUpdatedPayload {
  userId: string;
  itemId: string;
}

interface ItemRenamedPayload extends ItemUpdatedPayload {
  name: string;
}

interface ItemCompletePayload extends ItemUpdatedPayload {
  complete: boolean;
}

interface ServerToClientEvents {
  listRenamed: (payload: ListRenamedPayload) => void;
  listUpdated: ({ userId }: { userId: string }) => void;
  itemDeleted: (payload: ItemUpdatedPayload) => void;
  itemRenamed: (payload: ItemRenamedPayload) => void;
  itemComplete: (payload: ItemCompletePayload) => void;
}

interface ClientToServerEvents {
  joinRoom: (shoppingListId: string) => void;
  leaveRoom: (shoppingListId: string) => void;
}

export function useSocket(shoppingListId: string = "") {
  const queryClient = useQueryClient();
  const shoppingListQueryKey = getShoppingListQueryKey(shoppingListId);
  const itemsQueryKey = getItemsQueryKey(shoppingListId);

  const { isAuthenticated, userId: currentUserId } = useAuth();
  const { setItemRenameData, setItemCompleteData, setItemDeleteData } =
    useSetItemData(shoppingListId);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiUrl || !isAuthenticated || !shoppingListId) {
      return;
    }

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
      io(apiUrl);

    socket.on("connect", () => {
      socket.emit("joinRoom", shoppingListId);
    });

    socket.on("listRenamed", ({ userId, name }) => {
      if (currentUserId !== userId) {
        queryClient.setQueryData<ShoppingListWithMetadata>(
          shoppingListQueryKey,
          (currentData) => {
            if (!currentData) {
              return;
            }

            return {
              ...currentData,
              name,
            };
          },
        );
      }
    });

    socket.on("listUpdated", ({ userId }) => {
      if (currentUserId !== userId) {
        queryClient.invalidateQueries({ queryKey: itemsQueryKey });
      }
    });

    socket.on("itemRenamed", ({ userId, itemId, name }) => {
      if (currentUserId !== userId) {
        setItemRenameData(itemId, name);
      }
    });

    socket.on("itemComplete", ({ userId, itemId, complete }) => {
      if (currentUserId !== userId) {
        setItemCompleteData(itemId, complete);
      }
    });

    socket.on("itemDeleted", ({ userId, itemId }) => {
      if (currentUserId !== userId) {
        setItemDeleteData(itemId);
      }
    });

    return () => {
      socket.emit("leaveRoom", shoppingListId);
    };
  }, [
    isAuthenticated,
    shoppingListId,
    queryClient,
    itemsQueryKey,
    setItemDeleteData,
    setItemRenameData,
    setItemCompleteData,
    currentUserId,
  ]);
}
