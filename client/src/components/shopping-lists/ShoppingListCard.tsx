import { FC } from "react";
import {
  Box,
  Button,
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

interface ShoppingListCardProps {
  shoppingList: ShoppingListWithPreview;
}

export const ShoppingListCard: FC<ShoppingListCardProps> = ({
  shoppingList,
}) => {
  const router = useRouter();
  const { userId, email } = useAuthContext();
  const isShared = !!userId && shoppingList.createdByUser.email !== email;

  const remainingAfterPreview =
    shoppingList.incompleteItemCount - shoppingList.listItemsPreview.length;

  const hasPreview = shoppingList.listItemsPreview.length > 0;

  const isDarkMode = useTheme().palette.mode === "dark";
  const colorHex = isDarkMode
    ? shoppingList.color?.darkHex
    : shoppingList.color?.hex;

  function handleViewShoppingListClick() {
    router.push(`/shopping-lists/${shoppingList.id}`);
  }

  return (
    <Card sx={{ marginBottom: "1em", backgroundColor: colorHex }}>
      <CardHeader
        title={shoppingList.name}
        action={
          <ShoppingListActionsMenu
            shoppingListId={shoppingList.id}
            shoppingListName={shoppingList.name}
            shared={isShared}
            colorId={shoppingList.colorId}
          />
        }
      ></CardHeader>
      <CardContent>
        {hasPreview && (
          <Box marginBottom="1em">
            {shoppingList.listItemsPreview.map((listItem) => (
              <Typography key={listItem.id} variant="subtitle1">
                {listItem.name}
              </Typography>
            ))}
          </Box>
        )}
        {shoppingList.incompleteItemCount === 0 && (
          <Typography variant="subtitle2" color="text.secondary">
            All items completed
          </Typography>
        )}
        {remainingAfterPreview > 0 && (
          <Typography variant="subtitle2" color="text.secondary">
            {`${remainingAfterPreview} ${hasPreview ? "more" : ""} incomplete item${remainingAfterPreview > 1 ? "s" : ""}`}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Button
            onClick={handleViewShoppingListClick}
            size="small"
            color={shoppingList.colorId ? "inherit" : "primary"}
          >
            View
          </Button>
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
                  email={user.email}
                  userName={user.name}
                />
              ))}
            </Box>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};
