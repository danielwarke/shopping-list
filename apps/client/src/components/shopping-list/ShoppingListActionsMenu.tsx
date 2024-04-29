import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FC, useState } from "react";
import { DeleteShoppingListDialog } from "@/components/shopping-list/DeleteShoppingListDialog";

interface ShoppingListActionMenuProps {
  shoppingListId: string;
}

export const ShoppingListActionsMenu: FC<ShoppingListActionMenuProps> = ({
  shoppingListId,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  function handleClose() {
    setAnchorEl(null);
    setDeleteDialogOpen(false);
  }

  function handleOpenDeleteDialog() {
    setDeleteDialogOpen(true);
  }

  return (
    <div>
      <IconButton aria-label="settings" onClick={handleMenuClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="shopping-list-actions-menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
      >
        <MenuItem onClick={handleOpenDeleteDialog}>Delete List</MenuItem>
      </Menu>
      <DeleteShoppingListDialog
        open={deleteDialogOpen}
        handleClose={handleClose}
        shoppingListId={shoppingListId}
      />
    </div>
  );
};
