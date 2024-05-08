import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { FC, useState } from "react";
import { DeleteShoppingListDialog } from "@/components/shopping-list/dialogs/DeleteShoppingListDialog";
import { ShareShoppingListDialog } from "@/components/shopping-list/dialogs/ShareShoppingListDialog";
import { useSnackbarContext } from "@/contexts/SnackbarContext";

interface ShoppingListActionMenuProps {
  shoppingListId: string;
}

export const ShoppingListActionsMenu: FC<ShoppingListActionMenuProps> = ({
  shoppingListId,
}) => {
  const { showMessage } = useSnackbarContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState<"share" | "delete" | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  function handleClose() {
    setAnchorEl(null);
    setOpenDialog(null);
  }

  function handleOpenShareDialog() {
    setOpenDialog("share");
  }

  function handleShareClose(email?: string) {
    handleClose();

    if (email) {
      showMessage(
        `If the user exists in our system, they will receive an invitation email at ${email} to start sharing this shopping list.`,
      );
    }
  }

  function handleOpenDeleteDialog() {
    setOpenDialog("delete");
  }

  return (
    <div>
      <IconButton aria-label="settings" onClick={handleMenuClick}>
        <MoreVert />
      </IconButton>
      <Menu
        id="shopping-list-actions-menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
      >
        <MenuItem onClick={handleOpenShareDialog}>Share</MenuItem>
        <MenuItem onClick={handleOpenDeleteDialog}>Delete</MenuItem>
      </Menu>
      <ShareShoppingListDialog
        open={openDialog === "share"}
        handleClose={handleShareClose}
        shoppingListId={shoppingListId}
      />
      <DeleteShoppingListDialog
        open={openDialog === "delete"}
        handleClose={handleClose}
        shoppingListId={shoppingListId}
      />
    </div>
  );
};
