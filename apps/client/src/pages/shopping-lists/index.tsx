import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { Box, Container, Fab, Tooltip, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { ShoppingListCard } from "@/components/shopping-list/ShoppingListCard";
import { useAuth } from "@/hooks/use-auth";
import { NavBar } from "@/components/NavBar";

export default function ShoppingLists() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuth();

  const { data: shoppingLists = [], isLoading } = useQuery({
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
    let newName = "New Shopping List";
    const newShoppingLists = shoppingLists.filter(
      (shoppingList) =>
        shoppingList.name === newName ||
        (shoppingList.name.startsWith(newName) &&
          shoppingList.name.endsWith(")")),
    );

    if (newShoppingLists.length > 0) {
      newName += ` (${newShoppingLists.length + 1})`;
    }

    createShoppingListMutation.mutate({
      name: newName,
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
          {!shoppingLists.length && !isLoading && (
            <Typography variant="h5">
              Press the button in the bottom right corner to create a new
              shopping list 🛒
            </Typography>
          )}
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
