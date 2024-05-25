import { FC } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { LoadingButton } from "@mui/lab";
import { ErrorRenderer } from "@/components/ErrorRenderer";
import { useSnackbarContext } from "@/contexts/SnackbarContext";
import { shoppingListsQueryKey } from "@/api/query-keys";
import { ShoppingListWithPreview } from "@/api/client-sdk/Api";

interface DeleteShoppingListDialogProps {
  open: boolean;
  handleClose: (deleted?: boolean) => void;
  shoppingListId: string;
  shoppingListName: string;
  shared?: boolean;
}

export const DeleteShoppingListDialog: FC<DeleteShoppingListDialogProps> = ({
  open,
  handleClose,
  shoppingListId,
  shoppingListName,
  shared,
}) => {
  const { showMessage } = useSnackbarContext();
  const queryClient = useQueryClient();

  const deleteShoppingListMutation = useMutation({
    mutationFn: apiClient.shoppingLists.shoppingListsControllerRemove,
    onSuccess: (deletedShoppingList) => {
      showMessage(
        shared
          ? `You have been successfully removed from "${shoppingListName}"`
          : `Successfully deleted "${shoppingListName}"`,
      );

      queryClient.setQueryData<ShoppingListWithPreview[]>(
        shoppingListsQueryKey,
        (currentData) => {
          if (!currentData) {
            return [];
          }

          return currentData.filter(
            (shoppingList) => shoppingList.id !== deletedShoppingList.id,
          );
        },
      );

      handleClose(true);
    },
  });

  return (
    <Dialog onClose={() => handleClose()} open={open}>
      <DialogTitle>Please Confirm</DialogTitle>
      <DialogContent>
        <ErrorRenderer
          isError={deleteShoppingListMutation.isError}
          error={deleteShoppingListMutation.error}
        />
        <DialogContentText>
          {`Are you sure you want to ${shared ? "remove yourself from" : "delete"} "${shoppingListName}"?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()}>Cancel</Button>
        <LoadingButton
          onClick={() => deleteShoppingListMutation.mutate(shoppingListId)}
          loading={deleteShoppingListMutation.isPending}
          color="error"
        >
          Yes
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
