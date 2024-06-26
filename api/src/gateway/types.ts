import { ListItem } from "src/_gen/prisma-class/list_item";

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
  name?: string;
  complete?: boolean;
  header?: boolean;
}

export interface ItemsDeletedPayload {
  userId: string;
  itemIds: string[];
}

export interface ServerToClientEvents {
  listRenamed: (payload: ListRenamedPayload) => void;
  listReordered: (payload: ListReorderedPayload) => void;
  itemAppended: (payload: ItemAppendedPayload) => void;
  itemUpdated: (payload: ItemUpdatedPayload) => void;
  itemsDeleted: (payload: ItemsDeletedPayload) => void;
}
