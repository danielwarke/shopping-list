import { FC } from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import { ShoppingList } from "@/api/client-sdk/Api";

interface ShoppingListCardProps {
  shoppingList: ShoppingList;
}

export const ShoppingListCard: FC<ShoppingListCardProps> = ({
  shoppingList,
}) => {
  return (
    <Card>
      <CardHeader title={shoppingList.name}></CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};
