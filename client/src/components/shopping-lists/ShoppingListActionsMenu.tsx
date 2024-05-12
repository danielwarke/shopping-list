import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { FC, useState } from "react";
import { DeleteShoppingListDialog } from "@/components/shopping-lists/dialogs/DeleteShoppingListDialog";
import { ShareShoppingListDialog } from "@/components/shopping-lists/dialogs/ShareShoppingListDialog";

interface ShoppingListActionMenuProps {
  shoppingListId: string;
  shared?: boolean;
}

export const ShoppingListActionsMenu: FC<ShoppingListActionMenuProps> = ({
  shoppingListId,
  shared,
}) => {
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
        {!shared && <MenuItem onClick={handleOpenShareDialog}>Share</MenuItem>}
        <MenuItem onClick={handleOpenDeleteDialog}>
          {shared ? "Remove" : "Delete"}
        </MenuItem>
      </Menu>
      <ShareShoppingListDialog
        open={openDialog === "share"}
        handleClose={handleClose}
        shoppingListId={shoppingListId}
      />
      <DeleteShoppingListDialog
        open={openDialog === "delete"}
        handleClose={handleClose}
        shoppingListId={shoppingListId}
        shared={shared}
      />
    </div>
  );
};
