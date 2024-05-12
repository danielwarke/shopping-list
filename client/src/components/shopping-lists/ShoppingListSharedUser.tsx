import { FC, useState } from "react";
import { AccountCircle } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { RevokeListAccessDialog } from "@/components/shopping-lists/dialogs/RevokeListAccessDialog";

interface ShoppingListSharedUserProps {
  shoppingListId: string;
  email: string;
  userName: string;
}

export const ShoppingListSharedUser: FC<ShoppingListSharedUserProps> = ({
  shoppingListId,
  email,
  userName,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openRevokeDialog, setOpenRevokeDialog] = useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  function handleClose() {
    setAnchorEl(null);
    setOpenRevokeDialog(false);
  }

  function handleOpenRevokeDialog() {
    setOpenRevokeDialog(true);
  }

  return (
    <>
      <Menu
        id="shared-user-actions-menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
      >
        <MenuItem onClick={handleOpenRevokeDialog}>Revoke Access</MenuItem>
      </Menu>
      <Tooltip title={`Shared with ${userName}`}>
        <IconButton onClick={handleMenuClick} size="small">
          <AccountCircle color="action" sx={{ margin: "1vh" }} />
        </IconButton>
      </Tooltip>
      <RevokeListAccessDialog
        open={openRevokeDialog}
        handleClose={handleClose}
        shoppingListId={shoppingListId}
        email={email}
        userName={userName}
      />
    </>
  );
};
