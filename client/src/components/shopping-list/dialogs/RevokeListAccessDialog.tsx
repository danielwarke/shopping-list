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
import { RevokeAccessDto } from "@/api/client-sdk/Api";
import { useSnackbarContext } from "@/contexts/SnackbarContext";

interface RevokeListAccessDialogProps {
  open: boolean;
  handleClose: () => void;
  shoppingListId: string;
  email: string;
  userName: string;
}

export const RevokeListAccessDialog: FC<RevokeListAccessDialogProps> = ({
  open,
  handleClose,
  shoppingListId,
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
    onSuccess: () => {
      showMessage(`${userName} has been removed from the shopping list`);
      queryClient.invalidateQueries({ queryKey: ["shopping-lists"] });
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
          {`Are you sure you want to revoke ${userName}'s access from the selected shopping list?`}
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
