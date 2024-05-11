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

interface ShoppingListCardProps {
  shoppingList: ShoppingListWithPreview;
}

export const ShoppingListCard: FC<ShoppingListCardProps> = ({
  shoppingList,
}) => {
  const router = useRouter();
  const { userId } = useAuth(false);
  const isShared = !!userId && shoppingList.createdByUserId !== userId;

  function handleViewShoppingListClick() {
    router.push(`/shopping-lists/${shoppingList.id}`);
  }

  return (
    <Card variant="outlined" sx={{ marginBottom: "1em" }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            {shoppingList.name}
            {isShared && (
              <Tooltip title={`Shared by ${shoppingList.createdByUser.name}`}>
                <AccountCircle color="action" />
              </Tooltip>
            )}
          </Box>
        }
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
        <Button onClick={handleViewShoppingListClick} size="small">
          View
        </Button>
      </CardActions>
    </Card>
  );
};
