export interface ListRenamedPayload {
  userId: string;
  name: string;
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
  listUpdated: ({ userId }: { userId: string }) => void;
  itemDeleted: (payload: ItemUpdatedPayload) => void;
  itemRenamed: (payload: ItemRenamedPayload) => void;
  itemComplete: (payload: ItemCompletePayload) => void;
}
