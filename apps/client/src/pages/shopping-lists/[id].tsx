import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { apiClient } from "@/api/api-client";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Fab,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Add, ArrowBack } from "@mui/icons-material";
import { ShoppingListName } from "@/components/shopping-list/shopping-list-details/ShoppingListName";
import { NavBar } from "@/components/NavBar";
import { CreateListItemDto } from "@/api/client-sdk/Api";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ShoppingListDraggableItems } from "@/components/shopping-list/shopping-list-details/ShoppingListDraggableItems";

export default function ShoppingListDetails() {
  const router = useRouter();
  const { isAuthenticated } = useAuth(true);
  const shoppingListId = router.query.id as string;
  const queryClient = useQueryClient();
  const [autoFocusListItemId, setAutoFocusListItemId] = useState("");

  const {
    data: shoppingList,
    isError: shoppingListIsError,
    isLoading: shoppingListIsLoading,
  } = useQuery({
    queryKey: ["shopping-lists", shoppingListId],
    queryFn: () =>
      apiClient.shoppingLists.shoppingListsControllerFindOne(shoppingListId),
    enabled: isAuthenticated && !!shoppingListId,
  });

  const createListItemMutation = useMutation({
    mutationFn: (data: CreateListItemDto) =>
      apiClient.shoppingLists.listItemsControllerCreate(shoppingListId, data),
    onSuccess: (createdListItem) => {
      queryClient.invalidateQueries({
        queryKey: ["shopping-lists", shoppingListId, "items"],
      });
      setAutoFocusListItemId(createdListItem.id);
    },
  });

  function handleCreateListItem(sortOrder?: number) {
    createListItemMutation.mutate({
      sortOrder,
    });
  }

  function handleBackButtonClick() {
    queryClient.invalidateQueries({
      queryKey: ["shopping-lists", shoppingListId],
    });
    router.push("/shopping-lists");
  }

  return (
    <>
      <NavBar
        title="Shopping List Details"
        startComponent={
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={handleBackButtonClick}
          >
            <ArrowBack />
          </IconButton>
        }
      />
      <Container maxWidth="sm">
        {shoppingListIsError && (
          <Alert severity="error">Unable to load shopping list.</Alert>
        )}
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          marginTop="4vh"
        >
          {shoppingListIsLoading && <CircularProgress />}
          {shoppingList && (
            <ShoppingListName
              id={shoppingListId}
              currentName={shoppingList.name}
            />
          )}
          <Box marginTop="2vh" paddingBottom="16vh">
            <ShoppingListDraggableItems
              shoppingListId={shoppingListId}
              autoFocusListItemId={autoFocusListItemId}
              handleCreateListItem={handleCreateListItem}
            />
          </Box>
        </Box>
        <Tooltip title="New List Item">
          <Fab
            color="primary"
            sx={{ position: "fixed", bottom: "2em", right: "2em" }}
            onClick={() => handleCreateListItem()}
          >
            <Add />
          </Fab>
        </Tooltip>
      </Container>
    </>
  );
}
