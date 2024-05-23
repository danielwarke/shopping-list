import { useCallback, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useSetItemData } from "@/hooks/use-set-item-data";
import { useQueryClient } from "@tanstack/react-query";
import { getShoppingListQueryKey } from "@/api/query-keys";
import { ShoppingListWithMetadata } from "@/api/client-sdk/Api";
import { ClientToServerEvents, ServerToClientEvents } from "./socket.types";
import { useAuthContext } from "@/contexts/AuthContext";

export function useSocket(shoppingListId: string = "") {
  const queryClient = useQueryClient();
  const shoppingListQueryKey = getShoppingListQueryKey(shoppingListId);

  const { userId: currentUserId } = useAuthContext();
  const {
    setItemData,
    setItemAppendedData,
    setItemUpdateData,
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
    if (!apiUrl || !shoppingListId) {
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

    socket.on("itemUpdated", ({ userId, itemId, ...rest }) => {
      if (currentUserId !== userId) {
        setItemUpdateData(itemId, rest);
      }
    });

    socket.on("itemsDeleted", ({ userId, itemIds }) => {
      if (currentUserId !== userId) {
        setItemDeleteData(itemIds);
      }
    });

    return () => {
      socket.emit("leaveRoom", shoppingListId);
    };
  }, [
    currentUserId,
    setItemAppendedData,
    setItemData,
    setItemDeleteData,
    setItemUpdateData,
    setListRenameData,
    shoppingListId,
  ]);
}
