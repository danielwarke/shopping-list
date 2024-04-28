import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { Container } from "@mui/material";
import { ShoppingListCard } from "@/components/ShoppingListCard";
import { useAuth } from "@/hooks/use-auth";

export default function ShoppingLists() {
  const isAuthenticated = useAuth();

  const { data: shoppingLists = [] } = useQuery({
    queryKey: ["shopping-lists"],
    queryFn: apiClient.shoppingLists.shoppingListsControllerFindAll,
    enabled: isAuthenticated,
  });

  return (
    <Container maxWidth="sm">
      {shoppingLists.map((shoppingList) => (
        <ShoppingListCard key={shoppingList.id} shoppingList={shoppingList} />
      ))}
    </Container>
  );
}
