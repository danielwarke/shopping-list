import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Head from "next/head";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import SnackbarContextProvider from "@/contexts/SnackbarContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, useMediaQuery } from "@mui/material";
import { useEffect, useMemo } from "react";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: prefersDarkMode ? "dark" : "light",
      },
    });
  }, [prefersDarkMode]);

  useEffect(() => {
    const cleanClasses = () => {
      document.body.className = "";
    };
    document.addEventListener("touchend", cleanClasses, false);
    return () => {
      document.removeEventListener("touchend", cleanClasses, false);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Shopping List</title>
        <meta
          name="description"
          content="A smart and simple shopping list application"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <style jsx global>{`
          body {
            margin: 0;
          }
        `}</style>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <SnackbarContextProvider>
              <Component {...pageProps} />
              <CssBaseline enableColorScheme />
            </SnackbarContextProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </main>
    </>
  );
}
