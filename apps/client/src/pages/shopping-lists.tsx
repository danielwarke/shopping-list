import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { Container } from "@mui/material";
import { ShoppingListCard } from "@/components/shopping-list/ShoppingListCard";
import { useAuth } from "@/hooks/use-auth";
import { NavBar } from "@/components/NavBar";

export default function ShoppingLists() {
  const isAuthenticated = useAuth();

  const { data: shoppingLists = [] } = useQuery({
    queryKey: ["shopping-lists"],
    queryFn: apiClient.shoppingLists.shoppingListsControllerFindAll,
    enabled: isAuthenticated,
  });

  return (
    <>
      <NavBar title="Shopping Lists" />
      <Container maxWidth="sm">
        {shoppingLists.map((shoppingList) => (
          <ShoppingListCard key={shoppingList.id} shoppingList={shoppingList} />
        ))}
      </Container>
    </>
  );
}
