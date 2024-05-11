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
} from "@mui/material";
import { ShoppingListWithPreview } from "@/api/client-sdk/Api";
import { ShoppingListActionsMenu } from "@/components/shopping-list/ShoppingListActionsMenu";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/use-auth";
import { AccountCircle } from "@mui/icons-material";
import { ShoppingListSharedUser } from "@/components/shopping-list/ShoppingListSharedUser";

interface ShoppingListCardProps {
  shoppingList: ShoppingListWithPreview;
}

export const ShoppingListCard: FC<ShoppingListCardProps> = ({
  shoppingList,
}) => {
  const router = useRouter();
  const { userId, email } = useAuth(false);
  const isShared = !!userId && shoppingList.createdByUser.email !== email;

  function handleViewShoppingListClick() {
    router.push(`/shopping-lists/${shoppingList.id}`);
  }

  return (
    <Card variant="outlined" sx={{ marginBottom: "1em" }}>
      <CardHeader
        title={shoppingList.name}
        action={
          <ShoppingListActionsMenu
            shoppingListId={shoppingList.id}
            shared={isShared}
          />
        }
      ></CardHeader>
      <CardContent>
        {shoppingList.listItemsPreview.length > 0 && (
          <Box marginBottom="1em">
            {shoppingList.listItemsPreview.map((listItem, index) => (
              <Typography key={listItem.id} variant="subtitle1">
                {listItem.name}
                {index === shoppingList.listItemsPreview.length - 1
                  ? "..."
                  : ""}
              </Typography>
            ))}
          </Box>
        )}
        <Typography variant="subtitle2" color="text.secondary">
          {shoppingList.incompleteItemCount === 0
            ? "All items completed"
            : `${shoppingList.incompleteItemCount} incomplete item${shoppingList.incompleteItemCount !== 1 ? "s" : ""}`}
        </Typography>
      </CardContent>
      <CardActions>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Button onClick={handleViewShoppingListClick} size="small">
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
