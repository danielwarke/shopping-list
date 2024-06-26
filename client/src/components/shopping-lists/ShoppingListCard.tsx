import { FC } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { ShoppingListWithPreview } from "@/api/client-sdk/Api";
import { useRouter } from "next/router";
import { AccountCircle } from "@mui/icons-material";
import { ShoppingListSharedUser } from "@/components/shopping-lists/ShoppingListSharedUser";
import { ShoppingListActionsMenu } from "@/components/ShoppingListActionsMenu";
import { useAuthContext } from "@/contexts/AuthContext";
import { Draggable } from "react-smooth-dnd";

interface ShoppingListCardProps {
  shoppingList: ShoppingListWithPreview;
}

export const ShoppingListCard: FC<ShoppingListCardProps> = ({
  shoppingList,
}) => {
  const router = useRouter();
  const { userId, email } = useAuthContext();
  const isShared = !!userId && shoppingList.createdByUser.email !== email;

  const incompleteItemsPreview = shoppingList.listItemsPreview.filter(
    (item) => !item.complete,
  );

  const remainingAfterPreview =
    shoppingList.incompleteItemCount - incompleteItemsPreview.length;

  const isDarkMode = useTheme().palette.mode === "dark";
  const colorHex =
    (isDarkMode ? shoppingList.color?.darkHex : shoppingList.color?.hex) ??
    "background.paper";

  function handleViewShoppingListClick(e: React.MouseEvent) {
    const target = e.target as HTMLDivElement;
    if (target.classList.contains("details-nav-target")) {
      router.push(`/shopping-lists/${shoppingList.id}`);
    }
  }

  return (
    // @ts-ignore
    <Draggable key={shoppingList.id}>
      <Card
        sx={{
          marginBottom: "1em",
          backgroundColor: colorHex,
          "&:hover": {
            filter: "brightness(95%)",
          },
        }}
      >
        <CardHeader
          title={shoppingList.name}
          className="drag-handle"
          sx={{
            cursor: "grab",
            backgroundColor: colorHex,
            filter: "brightness(95%)",
            "&:hover": {
              filter: "brightness(80%)",
            },
          }}
          action={
            <ShoppingListActionsMenu
              shoppingListId={shoppingList.id}
              shoppingListName={shoppingList.name}
              shared={isShared}
              colorId={shoppingList.colorId}
            />
          }
        />
        <Box sx={{ cursor: "pointer" }} onClick={handleViewShoppingListClick}>
          <CardContent className="details-nav-target">
            {incompleteItemsPreview.length > 0 && (
              <Box marginBottom="1em" className="details-nav-target">
                {incompleteItemsPreview.map((listItem) => (
                  <Typography
                    key={listItem.id}
                    variant={listItem.header ? "h6" : "subtitle1"}
                    className="details-nav-target"
                  >
                    {listItem.name}
                  </Typography>
                ))}
              </Box>
            )}
            {shoppingList.incompleteItemCount === 0 && (
              <Typography
                variant="subtitle2"
                color="text.secondary"
                className="details-nav-target"
              >
                {shoppingList.listItemsPreview.length > 0
                  ? "All items completed"
                  : "No items"}
              </Typography>
            )}
            {remainingAfterPreview > 0 && (
              <Typography
                variant="subtitle2"
                color="text.secondary"
                className="details-nav-target"
              >
                {`${remainingAfterPreview} more incomplete item${remainingAfterPreview > 1 ? "s" : ""}`}
              </Typography>
            )}
          </CardContent>
          <CardActions>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
              className="details-nav-target"
            >
              <div />
              {isShared && (
                <Tooltip title={`Shared by ${shoppingList.createdByUser.name}`}>
                  <AccountCircle color="action" sx={{ margin: "1vh" }} />
                </Tooltip>
              )}
              {shoppingList.sharedWithUsers.length > 0 && (
                <Box>
                  {shoppingList.sharedWithUsers.map((user) => (
                    <ShoppingListSharedUser
                      key={user.email}
                      shoppingListId={shoppingList.id}
                      shoppingListName={shoppingList.name}
                      email={user.email}
                      userName={user.name}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </CardActions>
        </Box>
      </Card>
    </Draggable>
  );
};
