import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { FC, useMemo, useState } from "react";
import { DeleteShoppingListDialog } from "@/components/shopping-lists/dialogs/DeleteShoppingListDialog";
import { ShareShoppingListDialog } from "@/components/shopping-lists/dialogs/ShareShoppingListDialog";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { useSetItemData } from "@/hooks/use-set-item-data";
import { SetListColorDialog } from "@/components/shopping-lists/dialogs/SetListColorDialog";
import { useAuth } from "@/hooks/use-auth";
import { useSnackbarContext } from "@/contexts/SnackbarContext";

interface ShoppingListActionMenuProps {
  shoppingListId: string;
  colorId?: string;
  shared?: boolean;
  detail?: boolean;
}

export const ShoppingListActionsMenu: FC<ShoppingListActionMenuProps> = ({
  shoppingListId,
  colorId,
  shared,
  detail,
}) => {
  const router = useRouter();
  const { showMessage } = useSnackbarContext();
  const { emailVerified } = useAuth(false);

  const { setItemDeleteData } = useSetItemData(shoppingListId);

  const removeCompleteItemsMutation = useMutation({
    mutationFn: () =>
      apiClient.shoppingLists.listItemsControllerRemoveCompleteItems(
        shoppingListId,
      ),
    onSuccess: (deletedItems) => {
      const itemIds = deletedItems.map((item) => item.id);
      setItemDeleteData(itemIds);
    },
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState<
    "share" | "setColor" | "delete" | null
  >(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  function handleClose() {
    setAnchorEl(null);
    setOpenDialog(null);
  }

  function handleOpenShareDialog() {
    if (!emailVerified) {
      showMessage("You must verify your email address before sharing lists");
      return;
    }

    setOpenDialog("share");
  }

  function handleOpenSetColorDialog() {
    setOpenDialog("setColor");
  }

  function handleOpenDeleteDialog() {
    setOpenDialog("delete");
  }

  const deleteLabel = useMemo(() => {
    if (shared) {
      return `Remove ${detail ? "yourself from list" : ""}`;
    }

    return "Delete";
  }, [detail, shared]);

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
        <MenuItem onClick={handleOpenSetColorDialog}>Set color</MenuItem>
        {detail && (
          <MenuItem
            onClick={() => {
              removeCompleteItemsMutation.mutate();
              handleClose();
            }}
          >
            Remove completed items
          </MenuItem>
        )}
        <MenuItem onClick={handleOpenDeleteDialog}>{deleteLabel}</MenuItem>
      </Menu>
      <ShareShoppingListDialog
        open={openDialog === "share"}
        handleClose={handleClose}
        shoppingListId={shoppingListId}
      />
      <SetListColorDialog
        open={openDialog === "setColor"}
        handleClose={handleClose}
        initialColorId={colorId}
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
