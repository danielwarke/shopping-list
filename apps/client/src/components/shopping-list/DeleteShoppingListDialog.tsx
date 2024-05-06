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

interface DeleteShoppingListDialogProps {
  open: boolean;
  handleClose: () => void;
  shoppingListId: string;
}

export const DeleteShoppingListDialog: FC<DeleteShoppingListDialogProps> = ({
  open,
  handleClose,
  shoppingListId,
}) => {
  const queryClient = useQueryClient();

  const deleteShoppingListMutation = useMutation({
    mutationFn: apiClient.shoppingLists.shoppingListsControllerRemove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-lists"] });
    },
  });

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Please Confirm</DialogTitle>
      <DialogContent>
        <ErrorRenderer
          isError={deleteShoppingListMutation.isError}
          error={deleteShoppingListMutation.error}
        />
        <DialogContentText>
          Are you sure you want to delete the selected shopping list?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <LoadingButton
          onClick={() => deleteShoppingListMutation.mutate(shoppingListId)}
          loading={deleteShoppingListMutation.isPending}
          color="error"
        >
          Yes, delete it
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
