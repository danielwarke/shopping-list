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
import { NavBar } from "@/components/NavBar";
import { useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getItemsQueryKey, getShoppingListQueryKey } from "@/api/query-keys";
import { useSocket } from "@/hooks/use-socket";
import { ListName } from "@/components/list-details/ListName";
import { DraggableItems } from "@/components/list-details/DraggableItems";
import { useSetItemData } from "@/hooks/use-set-item-data";
import { AppendListItemDto } from "@/api/client-sdk/Api";

export default function ShoppingListDetails() {
  const router = useRouter();
  const { isAuthenticated } = useAuth(true);
  const shoppingListId = router.query.id as string;

  const { setItemAppendedData } = useSetItemData(shoppingListId);

  const queryClient = useQueryClient();
  const shoppingListQueryKey = getShoppingListQueryKey(shoppingListId);
  const itemsQueryKey = getItemsQueryKey(shoppingListId);

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

  const invalidateCache = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: itemsQueryKey,
    });
  }, [itemsQueryKey, queryClient]);

  useSocket(shoppingList?.isShared ? shoppingListId : undefined);

  const appendListItemMutation = useMutation({
    mutationFn: (data: AppendListItemDto) =>
      apiClient.shoppingLists.listItemsControllerAppend(shoppingListId, data),
    onSuccess: setItemAppendedData,
    onError: invalidateCache,
  });

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
            <>
              <ListName id={shoppingListId} currentName={shoppingList.name} />
              <Box marginTop="2vh" paddingBottom="16vh">
                <DraggableItems shoppingListId={shoppingListId} />
              </Box>
              <Tooltip title="New List Item">
                <Fab
                  color="primary"
                  sx={{ position: "fixed", bottom: "2em", right: "2em" }}
                  onClick={() => appendListItemMutation.mutate({})}
                >
                  <Add />
                </Fab>
              </Tooltip>
            </>
          )}
        </Box>
      </Container>
    </>
  );
}
