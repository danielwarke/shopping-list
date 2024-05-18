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
import { useSocket } from "@/hooks/use-socket";
import { ListDetails } from "@/components/list-details/ListDetails";
import { ShoppingListActionsMenu } from "@/components/ShoppingListActionsMenu";

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

  useSocket(shoppingList?.isShared ? shoppingListId : undefined);

  const isShared = !!userId && shoppingList?.createdByUserId !== userId;

  function handleBackButtonClick() {
    queryClient.invalidateQueries({
      queryKey: shoppingListQueryKey,
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
        endComponent={
          <ShoppingListActionsMenu
            shoppingListId={shoppingListId}
            shared={isShared}
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
          {shoppingList && (
            <ListDetails
              shoppingListId={shoppingListId}
              shoppingListName={shoppingList.name}
            />
          )}
        </Box>
      </Container>
    </>
  );
}
