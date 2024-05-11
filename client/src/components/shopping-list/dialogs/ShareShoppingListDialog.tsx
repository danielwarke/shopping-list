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

interface ShareShoppingListDialogProps {
  open: boolean;
  handleClose: (successEmail?: string) => void;
  shoppingListId: string;
}

export const ShareShoppingListDialog: FC<ShareShoppingListDialogProps> = ({
  open,
  handleClose,
  shoppingListId,
}) => {
  const [email, setEmail] = useState("");

  const shareShoppingListMutation = useMutation({
    mutationFn: (data: ShareShoppingListDto) =>
      apiClient.listSharing.listSharingControllerShare(shoppingListId, data),
    onSuccess: () => handleClose(email),
  });

  return (
    <Dialog onClose={() => handleClose()} open={open}>
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
        <Button onClick={() => handleClose()}>Cancel</Button>
        <LoadingButton
          disabled={!email}
          onClick={() =>
            shareShoppingListMutation.mutate({ otherUserEmail: email })
          }
          loading={shareShoppingListMutation.isPending}
        >
          Share
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
