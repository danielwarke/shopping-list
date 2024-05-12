import { FC } from "react";
import { TextField } from "@mui/material";
import { useDebounceState } from "@/hooks/use-debounce-state";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { UpdateShoppingListDto } from "@/api/client-sdk/Api";
import { getShoppingListQueryKey } from "@/api/query-keys";

interface ListNameProps {
  id: string;
  currentName: string;
}

export const ListName: FC<ListNameProps> = ({ id, currentName }) => {
  const queryClient = useQueryClient();
  const shoppingListQueryKey = getShoppingListQueryKey(id);

  const renameShoppingListMutation = useMutation({
    mutationFn: (data: UpdateShoppingListDto) =>
      apiClient.shoppingLists.shoppingListsControllerRename(id, data),
    onError: () => {
      queryClient.invalidateQueries({ queryKey: shoppingListQueryKey });
    },
  });

  const [name, setName] = useDebounceState(currentName, (newName) => {
    renameShoppingListMutation.mutate({ name: newName });
  });

  return (
    <TextField
      value={name}
      onChange={(e) => setName(e.target.value)}
      variant="standard"
      placeholder="Shopping List Name"
      fullWidth
      inputProps={{
        sx: { fontSize: "2em" },
      }}
    />
  );
};