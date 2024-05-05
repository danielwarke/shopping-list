import { FC } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import { ShoppingListWithPreview } from "@/api/client-sdk/Api";
import { ShoppingListActionsMenu } from "@/components/shopping-list/ShoppingListActionsMenu";
import { useRouter } from "next/router";

interface ShoppingListCardProps {
  shoppingList: ShoppingListWithPreview;
}

export const ShoppingListCard: FC<ShoppingListCardProps> = ({
  shoppingList,
}) => {
  const router = useRouter();

  function handleViewShoppingListClick() {
    router.push(`/shopping-lists/${shoppingList.id}`);
  }

  return (
    <Card variant="outlined" sx={{ marginBottom: "1em" }}>
      <CardHeader
        title={shoppingList.name}
        action={<ShoppingListActionsMenu shoppingListId={shoppingList.id} />}
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
          View Shopping List
        </Button>
      </CardActions>
    </Card>
  );
};
