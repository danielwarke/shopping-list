import {
  FC,
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { Snackbar } from "@mui/material";

export interface SnackbarContextValues {
  showMessage: (message: string) => void;
}

export const SnackbarContext = createContext<SnackbarContextValues>({
  showMessage: (message) =>
    console.warn("showMessage needs to be implemented", message),
});

const SnackbarContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  function showMessage(m: string) {
    setMessage(m);
    setOpen(true);
  }

  function handleClose(_: React.SyntheticEvent | Event, reason?: string) {
    if (reason === "clickaway") {
      return;
    }

    setMessage("");
    setOpen(false);
  }

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar
        open={open}
        message={message}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleClose}
      />
    </SnackbarContext.Provider>
  );
};

export function useSnackbarContext() {
  return useContext(SnackbarContext);
}

export default SnackbarContextProvider;
