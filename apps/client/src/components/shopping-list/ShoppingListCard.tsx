import { FC } from "react";
import {
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
        <Typography variant="subtitle1" color="text.secondary">
          {`Items remaining: ${shoppingList.incompleteItemCount}`}
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
