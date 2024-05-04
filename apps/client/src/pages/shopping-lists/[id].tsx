import { useQuery } from "@tanstack/react-query";
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
import { ShoppingListName } from "@/components/shopping-list/shopping-list-details/ShoppingListName";
import { NavBar } from "@/components/NavBar";

export default function ShoppingListDetails() {
  const router = useRouter();
  const shoppingListId = router.query.id as string;

  const {
    data: shoppingList,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["shopping-lists", shoppingListId],
    queryFn: () =>
      apiClient.shoppingLists.shoppingListsControllerFindOne(shoppingListId),
  });

  return (
    <>
      <NavBar
        title="Shopping List Details"
        startComponent={
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => router.push("/shopping-lists")}
          >
            <ArrowBack />
          </IconButton>
        }
      />
      <Container maxWidth="sm">
        {isError && (
          <Alert severity="error">Unable to load shopping list.</Alert>
        )}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          marginTop="4vh"
        >
          {isLoading && <CircularProgress />}
          {shoppingList && (
            <ShoppingListName
              id={shoppingListId}
              currentName={shoppingList.name}
            />
          )}
        </Box>
      </Container>
    </>
  );
}
