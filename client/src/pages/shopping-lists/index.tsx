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
import { NoteAdd } from "@mui/icons-material";
import { ShoppingListCard } from "@/components/shopping-lists/ShoppingListCard";
import { NavBar } from "@/components/NavBar";
import { shoppingListsQueryKey } from "@/api/query-keys";
import { EmailVerification } from "@/components/EmailVerification";
import AuthContextProvider from "@/contexts/AuthContext";
import { AcceptListInvite } from "@/components/AccpetListInvite";
import { Container as DraggableContainer } from "react-smooth-dnd";
import { ShoppingListWithPreview } from "@/api/client-sdk/Api";

export default function ShoppingLists() {
  const queryClient = useQueryClient();

  function invalidateCache() {
    queryClient.invalidateQueries({ queryKey: shoppingListsQueryKey });
  }

  const { data: shoppingLists = [], isLoading } = useQuery({
    queryKey: shoppingListsQueryKey,
    queryFn: apiClient.shoppingLists.shoppingListsControllerFindAll,
  });

  const createShoppingListMutation = useMutation({
    mutationFn: apiClient.shoppingLists.shoppingListsControllerCreate,
    onSuccess: invalidateCache,
  });

  const reorderListsMutation = useMutation({
    mutationFn: apiClient.shoppingLists.shoppingListsControllerReorder,
    onError: invalidateCache,
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

  function onDropHandler({
    removedIndex,
    addedIndex,
  }: {
    removedIndex: number | null;
    addedIndex: number | null;
  }) {
    if (removedIndex === null || addedIndex === null) {
      return;
    }

    const reorderedLists = [...shoppingLists];
    const listsToMove = reorderedLists[removedIndex];
    reorderedLists.splice(removedIndex, 1);
    reorderedLists.splice(addedIndex, 0, listsToMove);
    queryClient.setQueryData<ShoppingListWithPreview[]>(
      shoppingListsQueryKey,
      reorderedLists,
    );

    const updatedOrder = reorderedLists.map(({ id }, index) => ({
      shoppingListId: id,
      sortOrder: index + 1,
    }));

    reorderListsMutation.mutate({ order: updatedOrder });
  }

  return (
    <AuthContextProvider>
      <NavBar title="Shopping Lists" />
      <Container maxWidth="xs">
        <EmailVerification />
        <AcceptListInvite />
        <Box marginBottom="1vh">&nbsp;</Box>
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
        {!shoppingLists.length && !isLoading && (
          <Typography variant="h5">
            No shopping lists found. Press the button in the bottom right corner
            to create a new shopping list 🛒
          </Typography>
        )}
        <Box marginBottom="25vh">
          {/* @ts-ignore */}
          <DraggableContainer
            lockAxis="y"
            onDrop={onDropHandler}
            dragHandleSelector=".drag-handle"
          >
            {shoppingLists.map((shoppingList) => (
              <ShoppingListCard
                key={shoppingList.id}
                shoppingList={shoppingList}
              />
            ))}
          </DraggableContainer>
        </Box>
        <Tooltip title="New Shopping List">
          <Fab
            color="primary"
            sx={{ position: "fixed", bottom: "2em", right: "2em" }}
            onClick={handleCreateButtonClicked}
          >
            <NoteAdd />
          </Fab>
        </Tooltip>
      </Container>
    </AuthContextProvider>
  );
}
