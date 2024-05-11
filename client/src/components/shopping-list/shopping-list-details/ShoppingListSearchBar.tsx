import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Backspace, Search } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { FC } from "react";

interface ShoppingListSearchBarProps {
  shoppingListId: string;
  search: string;
  setSearch: (value: string) => void;
}

export const ShoppingListSearchBar: FC<ShoppingListSearchBarProps> = ({
  shoppingListId,
  search,
  setSearch,
}) => {
  const queryClient = useQueryClient();

  return (
    <TextField
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onFocus={() =>
        queryClient.invalidateQueries({
          queryKey: ["shopping-lists", shoppingListId, "items"],
        })
      }
      fullWidth
      size="small"
      placeholder="Search your shopping list"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setSearch("")} size="small">
              <Backspace />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{ marginY: "1vh" }}
    />
  );
};
