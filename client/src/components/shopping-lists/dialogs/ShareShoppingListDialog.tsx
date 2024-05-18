import { FC, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { LoadingButton } from "@mui/lab";
import { ErrorRenderer } from "@/components/ErrorRenderer";
import { ShareShoppingListDto } from "@/api/client-sdk/Api";
import { useSnackbarContext } from "@/contexts/SnackbarContext";

interface ShareShoppingListDialogProps {
  open: boolean;
  handleClose: () => void;
  shoppingListId: string;
}

export const ShareShoppingListDialog: FC<ShareShoppingListDialogProps> = ({
  open,
  handleClose,
  shoppingListId,
}) => {
  const { showMessage } = useSnackbarContext();
  const [email, setEmail] = useState("");

  function close() {
    handleClose();
    setEmail("");
  }

  const shareShoppingListMutation = useMutation({
    mutationFn: (data: ShareShoppingListDto) =>
      apiClient.listSharing.listSharingControllerShare(shoppingListId, data),
    onSuccess: () => {
      showMessage(
        `An invite was sent to ${email} to start sharing this shopping list.`,
      );
      close();
    },
  });

  return (
    <Dialog onClose={() => close()} open={open}>
      <DialogTitle>Share Shopping List</DialogTitle>
      <DialogContent>
        <ErrorRenderer
          isError={shareShoppingListMutation.isError}
          error={shareShoppingListMutation.error}
        />
        <DialogContentText sx={{ marginY: "2vh" }}>
          By sharing a shopping list with another user, you can collaborate
          together in real time!
        </DialogContentText>
        <TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          type="email"
          placeholder="jdoe@email.com"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => close()}>Cancel</Button>
        <LoadingButton
          disabled={!email}
          onClick={() => shareShoppingListMutation.mutate({ email })}
          loading={shareShoppingListMutation.isPending}
        >
          Share
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
