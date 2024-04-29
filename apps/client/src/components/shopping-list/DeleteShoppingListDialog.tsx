import { FC } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import LoadingButton from "@mui/lab/LoadingButton";
import { getErrorMessages } from "@/api/utils";
import Alert from "@mui/material/Alert";

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

  const errorMessages = getErrorMessages(deleteShoppingListMutation.error);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Please Confirm</DialogTitle>
      <DialogContent>
        {deleteShoppingListMutation.isError && (
          <>
            {errorMessages.map((message) => (
              <Alert key={message} severity="error">
                Error: {message}
              </Alert>
            ))}
          </>
        )}
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
