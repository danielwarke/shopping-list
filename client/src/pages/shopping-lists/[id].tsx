import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { apiClient } from "@/api/api-client";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  IconButton,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { NavBar } from "@/components/NavBar";
import { useAuth } from "@/hooks/use-auth";
import { getShoppingListQueryKey } from "@/api/query-keys";
import { ListDetails } from "@/components/list-details/ListDetails";
import { ShoppingListActionsMenu } from "@/components/ShoppingListActionsMenu";
import ShoppingListContextProvider from "@/contexts/ShoppingListContext";

export default function ShoppingListDetails() {
  const router = useRouter();
  const { isAuthenticated, userId } = useAuth(true);
  const shoppingListId = router.query.id as string;

  const queryClient = useQueryClient();
  const shoppingListQueryKey = getShoppingListQueryKey(shoppingListId);

  const {
    data: shoppingList,
    isError: shoppingListIsError,
    isLoading: shoppingListIsLoading,
  } = useQuery({
    queryKey: shoppingListQueryKey,
    queryFn: () =>
      apiClient.shoppingLists.shoppingListsControllerFindOne(shoppingListId),
    enabled: isAuthenticated && !!shoppingListId,
  });

  const isShared = !!userId && shoppingList?.createdByUserId !== userId;

  function handleBackButtonClick() {
    queryClient.invalidateQueries({
      queryKey: shoppingListQueryKey,
    });
    router.push("/shopping-lists");
  }

  return (
    <ShoppingListContextProvider shoppingList={shoppingList}>
      <NavBar
        title="List Details"
        transparent={!!shoppingList?.colorId}
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
        endComponent={
          <ShoppingListActionsMenu
            shoppingListId={shoppingListId}
            shared={isShared}
            colorId={shoppingList?.colorId}
            detail
          />
        }
      />
      <Container maxWidth="sm">
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          marginTop="4vh"
        >
          {shoppingListIsLoading && (
            <CircularProgress sx={{ alignSelf: "center" }} />
          )}
          {shoppingListIsError && (
            <Alert severity="error">Unable to load shopping list.</Alert>
          )}
          {shoppingList && <ListDetails />}
        </Box>
      </Container>
    </ShoppingListContextProvider>
  );
}
