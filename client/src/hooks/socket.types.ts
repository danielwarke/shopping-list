import { ListItem } from "@/api/client-sdk/Api";

export interface ListRenamedPayload {
  userId: string;
  name: string;
}

export interface ListReorderedPayload {
  userId: string;
  reorderedList: ListItem[];
}

export interface ItemAppendedPayload {
  userId: string;
  appendedItem: ListItem;
}

export interface ItemUpdatedPayload {
  userId: string;
  itemId: string;
}

export interface ItemRenamedPayload extends ItemUpdatedPayload {
  name: string;
}

export interface ItemCompletePayload extends ItemUpdatedPayload {
  complete: boolean;
}

export interface ServerToClientEvents {
  listRenamed: (payload: ListRenamedPayload) => void;
  listReordered: (payload: ListReorderedPayload) => void;
  itemAppended: (payload: ItemAppendedPayload) => void;
  itemRenamed: (payload: ItemRenamedPayload) => void;
  itemComplete: (payload: ItemCompletePayload) => void;
  itemDeleted: (payload: ItemUpdatedPayload) => void;
}

export interface ClientToServerEvents {
  joinRoom: (shoppingListId: string) => void;
  leaveRoom: (shoppingListId: string) => void;
}
