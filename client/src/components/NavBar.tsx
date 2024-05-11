import { FC } from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/router";

interface NavBarProps {
  title: string;
  startComponent?: React.ReactNode;
}

export const NavBar: FC<NavBarProps> = ({ title, startComponent }) => {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("auth_token");
    router.push("/login");
  }

  return (
    <AppBar position="sticky" sx={{ top: 0, zIndex: 99 }}>
      <Toolbar>
        {startComponent}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};
