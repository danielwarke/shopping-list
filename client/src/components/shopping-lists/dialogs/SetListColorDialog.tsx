import { FC, useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { LoadingButton } from "@mui/lab";
import { ErrorRenderer } from "@/components/ErrorRenderer";
import { SetListColorDto } from "@/api/client-sdk/Api";
import { shoppingListsQueryKey } from "@/api/query-keys";

interface SetListColorDialogProps {
  open: boolean;
  handleClose: () => void;
  shoppingListId: string;
  initialColorId?: string;
}

const defaultColor = "default";

export const SetListColorDialog: FC<SetListColorDialogProps> = ({
  open,
  handleClose,
  shoppingListId,
  initialColorId,
}) => {
  const queryClient = useQueryClient();

  const [colorId, setColorId] = useState(initialColorId ?? defaultColor);

  const { data: colors = [], isLoading: areColorsLoading } = useQuery({
    queryKey: ["colors"],
    queryFn: apiClient.shoppingLists.shoppingListsControllerListColors,
  });

  const setListColorMutation = useMutation({
    mutationFn: (data: SetListColorDto) =>
      apiClient.shoppingLists.shoppingListsControllerSetColor(
        shoppingListId,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shoppingListsQueryKey });
      handleClose();
    },
  });

  useEffect(() => {
    if (open && !areColorsLoading) {
      setColorId(initialColorId ?? defaultColor);
    }
  }, [open, initialColorId, areColorsLoading]);

  const currentColorHex = useMemo(() => {
    if (colorId) {
      return colors.find((c) => c.id === colorId)?.hex;
    }
  }, [colorId, colors]);

  return (
    <Dialog onClose={handleClose} open={open} fullWidth>
      <DialogTitle>Set List Color</DialogTitle>
      <DialogContent>
        <ErrorRenderer
          isError={setListColorMutation.isError}
          error={setListColorMutation.error}
        />
        <InputLabel>Choose a color</InputLabel>
        <Select
          value={colorId}
          onChange={(e) => setColorId(e.target.value)}
          sx={{ backgroundColor: currentColorHex }}
          fullWidth
        >
          <MenuItem value="default">Default</MenuItem>
          {colors.map((color) => (
            <MenuItem
              key={color.id}
              value={color.id}
              sx={{ backgroundColor: color.hex }}
            >
              {color.name}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <LoadingButton
          onClick={() =>
            setListColorMutation.mutate({
              colorId: colorId === defaultColor ? undefined : colorId,
            })
          }
          loading={setListColorMutation.isPending}
        >
          Set Color
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
