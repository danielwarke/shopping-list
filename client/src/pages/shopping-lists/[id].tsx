import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { apiClient } from "@/api/api-client";
import { Alert, Box, CircularProgress, Container } from "@mui/material";
import { getShoppingListQueryKey } from "@/api/query-keys";
import { ListDetails } from "@/components/list-details/ListDetails";
import ShoppingListContextProvider from "@/contexts/ShoppingListContext";
import AuthContextProvider from "@/contexts/AuthContext";
import { ListDetailsNavBar } from "@/components/list-details/ListDetailsNavBar";

export default function ShoppingListDetails() {
  const router = useRouter();
  const shoppingListId = router.query.id as string;

  const shoppingListQueryKey = getShoppingListQueryKey(shoppingListId);

  const {
    data: shoppingList,
    isError: shoppingListIsError,
    isLoading: shoppingListIsLoading,
  } = useQuery({
    queryKey: shoppingListQueryKey,
    queryFn: () =>
      apiClient.shoppingLists.shoppingListsControllerFindOne(shoppingListId),
    enabled: !!shoppingListId,
  });

  return (
    <AuthContextProvider>
      <ShoppingListContextProvider shoppingList={shoppingList}>
        <ListDetailsNavBar />
        <Box
          sx={{ backgroundColor: shoppingList?.color?.hex, minHeight: "100vh" }}
        >
          <Container maxWidth="sm">
            <Box
              display="flex"
              justifyContent="center"
              flexDirection="column"
              paddingTop="4vh"
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
        </Box>
      </ShoppingListContextProvider>
    </AuthContextProvider>
  );
}
