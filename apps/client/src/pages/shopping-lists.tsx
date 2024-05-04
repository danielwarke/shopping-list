import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { Box, Container, Fab, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";
import { ShoppingListCard } from "@/components/shopping-list/ShoppingListCard";
import { useAuth } from "@/hooks/use-auth";
import { NavBar } from "@/components/NavBar";

export default function ShoppingLists() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuth();

  const { data: shoppingLists = [] } = useQuery({
    queryKey: ["shopping-lists"],
    queryFn: apiClient.shoppingLists.shoppingListsControllerFindAll,
    enabled: isAuthenticated,
  });

  const createShoppingListMutation = useMutation({
    mutationFn: apiClient.shoppingLists.shoppingListsControllerCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-lists"] });
    },
  });

  function handleCreateButtonClicked() {
    createShoppingListMutation.mutate({
      name: `List #${shoppingLists.length + 1}`,
    });
  }

  return (
    <>
      <NavBar title="Shopping Lists" />
      <Container maxWidth="sm">
        <Box>
          {shoppingLists.map((shoppingList) => (
            <ShoppingListCard
              key={shoppingList.id}
              shoppingList={shoppingList}
            />
          ))}
        </Box>
        <Tooltip title="New Shopping List">
          <Fab
            color="primary"
            sx={{ position: "fixed", bottom: "2em", right: "2em" }}
            onClick={handleCreateButtonClicked}
          >
            <Add />
          </Fab>
        </Tooltip>
      </Container>
    </>
  );
}
