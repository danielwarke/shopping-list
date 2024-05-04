import { FC } from "react";
import {
  Card,
  CardActionArea,
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
    <Card variant="outlined" sx={{ marginBottom: "1em" }}>
      <CardActionArea>
        <CardHeader
          title={shoppingList.name}
          action={<ShoppingListActionsMenu shoppingListId={shoppingList.id} />}
        ></CardHeader>
        <CardContent>
          <Typography variant="subtitle1" color="text.secondary">
            {`Items remaining: ${shoppingList.incompleteItemCount}`}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
