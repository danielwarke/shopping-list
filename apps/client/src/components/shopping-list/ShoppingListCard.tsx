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

interface ShoppingListCardProps {
  shoppingList: ShoppingListWithPreview;
}

export const ShoppingListCard: FC<ShoppingListCardProps> = ({
  shoppingList,
}) => {
  return (
    <Card variant="outlined">
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
        <Button size="small">View Shopping List</Button>
      </CardActions>
    </Card>
  );
};
