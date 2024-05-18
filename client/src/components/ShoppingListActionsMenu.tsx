import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { FC, useState } from "react";
import { DeleteShoppingListDialog } from "@/components/shopping-lists/dialogs/DeleteShoppingListDialog";
import { ShareShoppingListDialog } from "@/components/shopping-lists/dialogs/ShareShoppingListDialog";
import { useRouter } from "next/router";

interface ShoppingListActionMenuProps {
  shoppingListId: string;
  shared?: boolean;
  detail?: boolean;
}

export const ShoppingListActionsMenu: FC<ShoppingListActionMenuProps> = ({
  shoppingListId,
  shared,
  detail,
}) => {
  const router = useRouter();

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
      <IconButton
        aria-label="settings"
        onClick={handleMenuClick}
        color="inherit"
      >
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
        handleClose={(deleted) => {
          handleClose();
          if (deleted && detail) {
            router.push("/shopping-lists");
          }
        }}
        shoppingListId={shoppingListId}
        shared={shared}
      />
    </div>
  );
};
