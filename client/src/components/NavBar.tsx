import { FC } from "react";
import { AppBar, Button, Toolbar, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";

interface NavBarProps {
  title?: string;
  backgroundColor?: string;
  startComponent?: React.ReactNode;
  endComponent?: React.ReactNode;
}

export const NavBar: FC<NavBarProps> = ({
  title,
  backgroundColor,
  startComponent,
  endComponent,
}) => {
  const router = useRouter();
  const isDarkMode = useTheme().palette.mode === "dark";

  function handleLogout() {
    localStorage.removeItem("auth_token");
    router.push("/login");
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        zIndex: 99,
        ...(backgroundColor && {
          backgroundColor,
          filter: "brightness(90%)",
          ...(!isDarkMode && {
            color: "rgba(0, 0, 0, 0.87)",
          }),
        }),
      }}
    >
      <Toolbar>
        {startComponent}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {endComponent || (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};
