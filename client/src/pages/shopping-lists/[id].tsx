import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { apiClient } from "@/api/api-client";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  useTheme,
} from "@mui/material";
import { getShoppingListQueryKey } from "@/api/query-keys";
import ShoppingListContextProvider, {
  emptyList,
} from "@/contexts/ShoppingListContext";
import AuthContextProvider from "@/contexts/AuthContext";
import { ListDetailsNavBar } from "@/components/list-details/ListDetailsNavBar";
import { ListName } from "@/components/list-details/ListName";
import { DraggableItems } from "@/components/list-details/DraggableItems";

export default function ShoppingListDetails() {
  const router = useRouter();
  const shoppingListId = router.query.id as string;

  const shoppingListQueryKey = getShoppingListQueryKey(shoppingListId);

  const {
    data: shoppingList = emptyList,
    isError: shoppingListIsError,
    isLoading: shoppingListIsLoading,
  } = useQuery({
    queryKey: shoppingListQueryKey,
    queryFn: () =>
      apiClient.shoppingLists.shoppingListsControllerFindOne(shoppingListId),
    enabled: !!shoppingListId,
  });

  const isDarkMode = useTheme().palette.mode === "dark";

  return (
    <AuthContextProvider>
      <ShoppingListContextProvider {...shoppingList}>
        <ListDetailsNavBar />
        <Box
          sx={{
            backgroundColor: isDarkMode
              ? shoppingList.color?.darkHex
              : shoppingList.color?.hex,
            minHeight: "100vh",
          }}
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
              {!!shoppingList.id && (
                <>
                  <ListName />
                  <Box marginTop="2vh" paddingBottom="16vh">
                    <DraggableItems />
                  </Box>
                </>
              )}
            </Box>
          </Container>
        </Box>
      </ShoppingListContextProvider>
    </AuthContextProvider>
  );
}
