import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { Card, CardContent, CardHeader, Container } from "@mui/material";

export default function ShoppingLists() {
  const { data: shoppingLists = [] } = useQuery({
    queryKey: ["shopping-lists"],
    queryFn: apiClient.shoppingLists.shoppingListsControllerFindAll,
  });

  return (
    <Container maxWidth="sm">
      {shoppingLists.map((shoppingList) => (
        <Card key={shoppingList.id}>
          <CardHeader title={shoppingList.name}></CardHeader>
          <CardContent></CardContent>
        </Card>
      ))}
    </Container>
  );
}
