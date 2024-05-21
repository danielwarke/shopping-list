import { IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { ShoppingListActionsMenu } from "@/components/ShoppingListActionsMenu";
import { NavBar } from "@/components/NavBar";
import { shoppingListsQueryKey } from "@/api/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/contexts/AuthContext";
import { useShoppingListContext } from "@/contexts/ShoppingListContext";
import { useRouter } from "next/router";

export const ListDetailsNavBar = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { userId } = useAuthContext();
  const { id, colorId, color, createdByUserId } = useShoppingListContext();

  async function handleBackButtonClick() {
    await queryClient.invalidateQueries({
      queryKey: shoppingListsQueryKey,
    });
    router.push("/shopping-lists");
  }

  const isShared = !!userId && createdByUserId !== userId;

  return (
    <NavBar
      title="List Details"
      backgroundColor={color?.hex}
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
          shoppingListId={id}
          shared={isShared}
          colorId={colorId}
          detail
        />
      }
    />
  );
};
