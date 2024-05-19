import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import {
  Box,
  CircularProgress,
  Container,
  Fab,
  Tooltip,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { ShoppingListCard } from "@/components/shopping-lists/ShoppingListCard";
import { useAuth } from "@/hooks/use-auth";
import { NavBar } from "@/components/NavBar";
import { shoppingListsQueryKey } from "@/api/query-keys";

export default function ShoppingLists() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth(true);

  const { data: shoppingLists = [], isLoading } = useQuery({
    queryKey: shoppingListsQueryKey,
    queryFn: apiClient.shoppingLists.shoppingListsControllerFindAll,
    enabled: isAuthenticated,
  });

  const createShoppingListMutation = useMutation({
    mutationFn: apiClient.shoppingLists.shoppingListsControllerCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shoppingListsQueryKey });
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
      <Container maxWidth="sm" sx={{ marginTop: "4vh" }}>
        {isLoading && (
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
          >
            <CircularProgress />
          </Box>
        )}
        <Box sx={{ columns: "2 auto" }}>
          {shoppingLists.map((shoppingList) => (
            <ShoppingListCard
              key={shoppingList.id}
              shoppingList={shoppingList}
            />
          ))}
          {!shoppingLists.length && !isLoading && (
            <Typography variant="h5">
              No shopping lists found. Press the button in the bottom right
              corner to create a new shopping list 🛒
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
