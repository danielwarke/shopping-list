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
import { CreateListItemDto } from "@/api/client-sdk/Api";
import { useCallback, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getItemsQueryKey, getShoppingListQueryKey } from "@/api/query-keys";
import { useSocket } from "@/hooks/use-socket";
import { ListName } from "@/components/list-details/ListName";
import { ListSearchBar } from "@/components/list-details/ListSearchBar";
import { DraggableItems } from "@/components/list-details/DraggableItems";

export default function ShoppingListDetails() {
  const router = useRouter();
  const { isAuthenticated } = useAuth(true);
  const shoppingListId = router.query.id as string;

  const queryClient = useQueryClient();
  const shoppingListQueryKey = getShoppingListQueryKey(shoppingListId);
  const itemsQueryKey = getItemsQueryKey(shoppingListId);

  const [autoFocusListItemId, setAutoFocusListItemId] = useState("");
  const [search, setSearch] = useState("");

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

  const createListItemMutation = useMutation({
    mutationFn: (data: CreateListItemDto) =>
      apiClient.shoppingLists.listItemsControllerCreate(shoppingListId, data),
    onSuccess: (createdListItem) => {
      invalidateCache();
      setAutoFocusListItemId(createdListItem.id);
    },
    onError: invalidateCache,
  });

  function handleCreateListItem(sortOrder?: number) {
    createListItemMutation.mutate({
      sortOrder,
    });
  }

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
                <ListSearchBar
                  shoppingListId={shoppingListId}
                  search={search}
                  setSearch={(value) => {
                    setSearch(value);
                    setAutoFocusListItemId("");
                  }}
                />
                <DraggableItems
                  shoppingListId={shoppingListId}
                  autoFocusListItemId={autoFocusListItemId}
                  handleCreateListItem={handleCreateListItem}
                  search={search}
                />
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
            </>
          )}
        </Box>
      </Container>
    </>
  );
}
