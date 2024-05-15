import { useCallback, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/hooks/use-auth";
import { useSetItemData } from "@/hooks/use-set-item-data";
import { useQueryClient } from "@tanstack/react-query";
import { getShoppingListQueryKey } from "@/api/query-keys";
import { ShoppingListWithMetadata } from "@/api/client-sdk/Api";
import { ClientToServerEvents, ServerToClientEvents } from "./socket.types";

export function useSocket(shoppingListId: string = "") {
  const queryClient = useQueryClient();
  const shoppingListQueryKey = getShoppingListQueryKey(shoppingListId);

  const { isAuthenticated, userId: currentUserId } = useAuth();
  const {
    setItemData,
    setItemAppendedData,
    setItemRenameData,
    setItemCompleteData,
    setItemDeleteData,
  } = useSetItemData(shoppingListId);

  const setListRenameData = useCallback(
    (name: string) => {
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
    },
    [queryClient, shoppingListQueryKey],
  );

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
        setListRenameData(name);
      }
    });

    socket.on("listReordered", ({ userId, reorderedList }) => {
      if (currentUserId !== userId) {
        setItemData(reorderedList);
      }
    });

    socket.on("itemAppended", ({ userId, appendedItem }) => {
      if (currentUserId !== userId) {
        setItemAppendedData(appendedItem);
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
    currentUserId,
    isAuthenticated,
    setItemAppendedData,
    setItemCompleteData,
    setItemData,
    setItemDeleteData,
    setItemRenameData,
    setListRenameData,
    shoppingListId,
  ]);
}
