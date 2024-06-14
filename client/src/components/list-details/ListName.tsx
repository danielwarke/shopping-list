import { FC } from "react";
import { TextField } from "@mui/material";
import { useDebounceState } from "@/hooks/use-debounce-state";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { UpdateShoppingListDto } from "@/api/client-sdk/Api";
import { getShoppingListQueryKey } from "@/api/query-keys";
import { useShoppingListContext } from "@/contexts/ShoppingListContext";

export const ListName: FC = () => {
  const { id, name: currentName } = useShoppingListContext();
  const queryClient = useQueryClient();
  const shoppingListQueryKey = getShoppingListQueryKey(id);

  function invalidateCache() {
    queryClient.invalidateQueries({ queryKey: shoppingListQueryKey });
  }

  const renameShoppingListMutation = useMutation({
    mutationFn: (data: UpdateShoppingListDto) =>
      apiClient.shoppingLists.shoppingListsControllerRename(id, data),
    onError: invalidateCache,
  });

  const [name, setName] = useDebounceState(currentName, (newName) => {
    renameShoppingListMutation.mutate({ name: newName });
  });

  return (
    <TextField
      value={name}
      onChange={(e) => setName(e.target.value)}
      onBlur={invalidateCache}
      variant="standard"
      placeholder="Shopping List Name"
      fullWidth
      inputProps={{
        sx: { fontSize: "1.5em" },
      }}
    />
  );
};
