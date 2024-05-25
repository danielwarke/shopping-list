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
import { RevokeAccessDto, ShoppingListWithPreview } from "@/api/client-sdk/Api";
import { useSnackbarContext } from "@/contexts/SnackbarContext";
import { shoppingListsQueryKey } from "@/api/query-keys";

interface RevokeListAccessDialogProps {
  open: boolean;
  handleClose: () => void;
  shoppingListId: string;
  shoppingListName: string;
  email: string;
  userName: string;
}

export const RevokeListAccessDialog: FC<RevokeListAccessDialogProps> = ({
  open,
  handleClose,
  shoppingListId,
  shoppingListName,
  email,
  userName,
}) => {
  const { showMessage } = useSnackbarContext();
  const queryClient = useQueryClient();

  const revokeListAccessMutation = useMutation({
    mutationFn: (data: RevokeAccessDto) =>
      apiClient.listSharing.listSharingControllerRevokeAccess(
        shoppingListId,
        data,
      ),
    onSuccess: (updatedShoppingList) => {
      showMessage(`${userName} has been removed from "${shoppingListName}"`);
      queryClient.setQueryData<ShoppingListWithPreview[]>(
        shoppingListsQueryKey,
        (currentData) => {
          if (!currentData) {
            return [];
          }

          return currentData.map((shoppingList) => {
            if (shoppingList.id === updatedShoppingList.id) {
              return {
                ...shoppingList,
                sharedWithUsers: shoppingList.sharedWithUsers.filter(
                  (user) => user.email !== email,
                ),
              };
            }

            return shoppingList;
          });
        },
      );
      handleClose();
    },
  });

  return (
    <Dialog onClose={() => handleClose()} open={open}>
      <DialogTitle>Please Confirm</DialogTitle>
      <DialogContent>
        <ErrorRenderer
          isError={revokeListAccessMutation.isError}
          error={revokeListAccessMutation.error}
        />
        <DialogContentText sx={{ marginY: "2vh" }}>
          {`Are you sure you want to revoke ${userName}'s access from "${shoppingListName}"?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()}>Cancel</Button>
        <LoadingButton
          color="error"
          onClick={() => revokeListAccessMutation.mutate({ email })}
          loading={revokeListAccessMutation.isPending}
        >
          Revoke
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
