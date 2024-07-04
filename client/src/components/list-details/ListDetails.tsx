import { Box } from "@mui/material";
import { ListName } from "@/components/list-details/ListName";
import { DraggableItems } from "@/components/list-details/DraggableItems";
import { FC } from "react";
import { createId } from "@paralleldrive/cuid2";
import {
  useAppendListItemMutation,
  useInsertListItemMutation,
} from "@/api/mutation-hooks/list-item";

export const ListDetails: FC = () => {
  const appendListItemMutation = useAppendListItemMutation();
  const insertListItemMutation = useInsertListItemMutation();

  function handleAppend() {
    appendListItemMutation.mutate({
      id: createId(),
    });
  }

  function handleInsert(data: { sortOrder: number; index: number }) {
    insertListItemMutation.mutate({ ...data, id: createId() });
  }

  return (
    <>
      <ListName />
      <Box marginTop="2vh" paddingBottom="16vh">
        <DraggableItems
          appendListItem={handleAppend}
          insertListItem={handleInsert}
        />
      </Box>
    </>
  );
};
